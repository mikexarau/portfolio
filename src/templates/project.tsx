import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { transparentize, readableColor } from 'polished'
import styled from 'styled-components'
import { config, useSpring, animated } from 'react-spring'
import Layout from '../components/layout'
import { Box, AnimatedBox, Button } from '../elements'
import SEO from '../components/SEO'

const PBox = styled(AnimatedBox)`
  max-width: 1400px;
  margin: 0 auto;
`

const Content = styled(Box)<{ bg: string }>`
  columns:2;
  column-gap: 0rem;
  padding-right: 2rem;
  padding-left: 2rem;
  background-color: ${props => transparentize(0.9, props.bg)};
  @media (max-width: ${props => props.theme.breakpoints[3]}) {
    columns:1;
  }

  .gatsby-image-wrapper {
    padding-right: 0rem;
    padding-left: 0rem;
  }
  .gatsby-image-wrapper:not(:last-child) {
    margin-bottom: ${props => props.theme.space[5]};
    @media (max-width: ${props => props.theme.breakpoints[3]}) {
      margin-bottom: ${props => props.theme.space[8]};
    }
  }
`

const Category = styled(AnimatedBox)`
  letter-spacing: 0.05em;
  font-size: ${props => props.theme.fontSizes[1]};
  text-transform: uppercase;
  display: grid;
  grid-template-columns: 1fr;
`

const Description = styled(animated.div)`
  max-width: 960px;
  letter-spacing: -0.003em;
  --baseline-multiplier: 0.179;
  --x-height-multiplier: 0.35;
  line-height: 1.58;
  margin-top: 1.2rem;
`
const Link = styled(animated.div)`
  max-width: 960px;
  letter-spacing: -0.003em;
  --baseline-multiplier: 0.179;
  --x-height-multiplier: 0.35;
  line-height: 1.58;
  padding-top: 2rem;
`

const PButton = styled(Button)<{ color: string }>`
  background: ${props => (props.color === 'white' ? 'black' : props.color)};
  color: ${props => readableColor(props.color === 'white' ? 'black' : props.color)};
`

type PageProps = {
  data: {
    project: {
      title_detail: string
      date: string
      color: string
      category: string
      link: string
      desc: string
      slug: string
      parent: {
        modifiedTime: string
        birthTime: string
      }
      cover: {
        childImageSharp: {
          resize: {
            src: string
          }
        }
      }
    }
    images: {
      edges: {
        node: {
          name: string
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData
          }
        }
      }[]
    }
  }
}

const Project: React.FunctionComponent<PageProps> = ({ data: { project, images } }) => {
  const categoryAnimation = useSpring({
    config: config.slow,
    from: { opacity: 0, transform: 'translate3d(0, -30px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  })

  const titleAnimation = useSpring({ config: config.slow, delay: 300, from: { opacity: 0 }, to: { opacity: 1 } })
  const linkAnimation = useSpring({ config: config.slow, delay: 800, from: { opacity: 0 }, to: { opacity: 1 } })
  const descAnimation = useSpring({ config: config.slow, delay: 600, from: { opacity: 0 }, to: { opacity: 1 } })
  const imagesAnimation = useSpring({ config: config.slow, delay: 800, from: { opacity: 0 }, to: { opacity: 1 } })

  return (
    <Layout color={project.color}>
      <SEO
        pathname={project.slug}
        title={`${project.title_detail} | mxg`}
        desc={project.desc}
        node={project.parent}
        banner={project.cover.childImageSharp.resize.src}
        individual
      />
      <PBox py={10} px={[6, 6, 8, 10]}>
        <Category style={categoryAnimation}>{project.category}</Category>
        <animated.h1 style={titleAnimation}>{project.title_detail}</animated.h1>
        <Description style={descAnimation}>
          <div dangerouslySetInnerHTML={{ __html: project.desc }} />
        </Description>
        <Link style={linkAnimation} color={project.color}>
          <div dangerouslySetInnerHTML={{ __html: project.link }} />
        </Link>
      </PBox>
      <Content bg={project.color} py={10}>
        <PBox style={imagesAnimation} px={[0, 0, 0, 3]}>
          {images.edges.map(image => {
            const fluidImage = getImage(image.node.childImageSharp);
            return fluidImage ? (
              <GatsbyImage
                alt={image.node.name}
                key={fluidImage.images.fallback?.src}
                image={fluidImage}
              />
            ) : null;
          })}
        </PBox>
      </Content>
      <PBox textAlign="center" py={10} px={[6, 6, 8, 10]}>
        <h2>Want to start your own project?</h2>
        <PButton color={project.color} py={4} px={8}>
          Contact Me
        </PButton>
      </PBox>
    </Layout>
  )
}

export default Project

export const query = graphql`
  query ProjectTemplate($slug: String!, $images: String!) {
    project: projectsYaml(slug: { eq: $slug }) {
      title_detail
      color
      category
      link
      desc
      slug
      parent {
        ... on File {
          modifiedTime
          birthTime
        }
      }
      cover {
        childImageSharp {
          resize(width: 1200, height: 675, quality: 80) {
            src
          }
        }
      }
    }
    images: allFile(filter: { relativePath: { regex: $images } }) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, quality: 95, width: 1200)
          }
        }
      }
    }
  }
`
