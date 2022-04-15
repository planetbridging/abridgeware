import React from 'react'
import {
  Text,
  Flex,
  Grid,
  GridItem,
  Box,
  Center,
  Square,
  Circle,
  Stack,
  Button,
  HStack,
  Image,
  Link,
  Spacer
} from '@chakra-ui/react'
import { MdSegment, MdViewHeadline } from 'react-icons/md'

import logo from './imgs/bridgewarehub.png'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = { menuShow: false }
  }

  toggleMenu () {
    const { menuShow } = this.state
    if (menuShow) {
      this.setState({ menuShow: false })
    } else {
      this.setState({ menuShow: true })
    }
  }

  render () {
    const { menuShow } = this.state

    var menu = (
      <Box p={2} bg='black' color='white'>
        <Stack>
          <Text>Bridgeware</Text>
        </Stack>
      </Box>
    )
    var menuIcon = <MdSegment color='white' />
    if (!menuShow) {
      menu = <></>
      menuIcon = <MdViewHeadline color='white' />
    }

    return (
      <Flex>
        {menu}
        <Grid h='100vh' w='100%' templateColumns='repeat(5, 1fr)' gap={0}>
          <GridItem rowSpan={1} colSpan={5} bg='black'>
            <Box p={1} color='white'>
              <Flex>
                <Button variant='ghost' onClick={() => this.toggleMenu()}>
                  {menuIcon}
                </Button>
                <Spacer />
                <Box p='4'>
                  <Image
                    borderRadius='full'
                    boxSize='20px'
                    src={logo}
                    alt='Bridgeware'
                  />
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem rowSpan={60} colSpan={5} bg='#07B6FD'>
            <Box w='100%' h='100%' p={2} color='white'>
              <Center>
                <HStack>
                  <Image
                    borderRadius='full'
                    boxSize='75px'
                    src={logo}
                    alt='Bridgeware'
                  />
                  <Text fontSize='4xl'>Bridgeware</Text>
                </HStack>
              </Center>
            </Box>
          </GridItem>
          <GridItem rowSpan={1} colSpan={5} bg='black'>
            <Box p={1} color='white'>
              <Center>
                <Text>
                  Created by Shannon Setter -{' '}
                  <Link
                    href='https://github.com/planetbridging/bridgeware'
                    target='_bank'
                  >
                    Github
                  </Link>
                </Text>
              </Center>
            </Box>
          </GridItem>
        </Grid>
      </Flex>
    )
  }
}

export default Home
