import { Body, Column, Container, Html, Link, Row, Section, Text } from '@react-email/components'

export const FacebookPostsReactionsEmail = ({
  postsReactionsData,
}: {
  postsReactionsData: {
    postUrl: string
    postAuthor: string
    postText: string
    reactionsData: {
      reactionAuthor: string
      reactionText: string
    }[]
  }[]
}) => {
  const totalPosts = postsReactionsData.length
  const totalReactions = postsReactionsData.reduce(
    (sum, post) => sum + post.reactionsData.length,
    0,
  )

  return (
    <Html>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
            Reakcie vygenerované na FB posty
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Počet postov: {totalPosts}</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Počet reakcií: {totalReactions}
          </Text>

          {postsReactionsData.map((postGroup, postIndex) => (
            <Section
              key={postIndex}
              style={{
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom:
                  postIndex < postsReactionsData.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              {/* Post header */}
              <Row style={{ marginBottom: '10px' }}>
                <Column style={{ width: '80px', verticalAlign: 'top', paddingRight: '10px' }}>
                  <Text
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    Autor postu
                  </Text>
                </Column>
                <Column style={{ verticalAlign: 'top' }}>
                  <Text
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: 0,
                      color: '#333',
                    }}
                  >
                    {postGroup.postAuthor}
                  </Text>
                </Column>
              </Row>

              <Row style={{ marginBottom: '10px' }}>
                <Column style={{ width: '80px', verticalAlign: 'top', paddingRight: '10px' }}>
                  <Text
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    Link
                  </Text>
                </Column>
                <Column style={{ verticalAlign: 'top' }}>
                  <Link
                    href={postGroup.postUrl}
                    style={{
                      fontSize: '14px',
                      color: '#0066cc',
                      textDecoration: 'underline',
                      margin: 0,
                    }}
                  >
                    {postGroup.postUrl}
                  </Link>
                </Column>
              </Row>

              <Row style={{ marginBottom: '20px' }}>
                <Column style={{ width: '80px', verticalAlign: 'top', paddingRight: '10px' }}>
                  <Text
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    Post
                  </Text>
                </Column>
                <Column style={{ verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>
                    {postGroup.postText}
                  </Text>
                </Column>
              </Row>

              {/* Reactions */}
              {postGroup.reactionsData.map((reaction, reactionIndex) => (
                <Section
                  key={reactionIndex}
                  style={{
                    marginBottom: '15px',
                    paddingLeft: '20px',
                    borderLeft: '3px solid #e0e0e0',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      color: '#333',
                    }}
                  >
                    Reakcia #{reactionIndex + 1} — {reaction.reactionAuthor}
                  </Text>

                  <Text
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      margin: 0,
                      fontWeight: '600',
                      lineHeight: '1.5',
                    }}
                  >
                    {reaction.reactionText}
                  </Text>
                </Section>
              ))}
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
