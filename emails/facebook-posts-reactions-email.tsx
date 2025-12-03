import { Body, Column, Container, Html, Link, Row, Section, Text } from '@react-email/components'

export const FacebookPostsReactionsEmail = ({
  postsReactionsData,
}: {
  postsReactionsData: {
    author: string
    postText: string
    postUrl: string
    reaction: string
  }[]
}) => {
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
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Reakcie vygenerované na relevantné FB posty
          </Text>

          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Výsledok: {postsReactionsData.length} reakcií
          </Text>

          {postsReactionsData.map((post, index) => (
            <Section
              key={index}
              style={{
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: index < postsReactionsData.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Text
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                }}
              >
                Post #{index + 1}
              </Text>

              <Row style={{ marginBottom: '10px' }}>
                <Column style={{ width: '60px', verticalAlign: 'top', paddingRight: '10px' }}>
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
                    Autor
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
                    {post.author}
                  </Text>
                </Column>
              </Row>

              <Row style={{ marginBottom: '10px' }}>
                <Column style={{ width: '60px', verticalAlign: 'top', paddingRight: '10px' }}>
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
                    href={post.postUrl}
                    style={{
                      fontSize: '14px',
                      color: '#0066cc',
                      textDecoration: 'underline',
                      margin: 0,
                    }}
                  >
                    {post.postUrl}
                  </Link>
                </Column>
              </Row>

              <Row style={{ marginBottom: '10px' }}>
                <Column style={{ width: '60px', verticalAlign: 'top', paddingRight: '10px' }}>
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
                    {post.postText}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column style={{ width: '60px', verticalAlign: 'top', paddingRight: '10px' }}>
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
                    Reakcia
                  </Text>
                </Column>
                <Column style={{ verticalAlign: 'top' }}>
                  <Text
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      margin: 0,
                      fontWeight: '600',
                      lineHeight: '1.5',
                    }}
                  >
                    {post.reaction}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
