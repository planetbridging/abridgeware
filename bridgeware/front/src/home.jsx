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
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'

import logo from './imgs/bridgewarehub.png'
import logoCpelookup from './imgs/cpelookup.png'

var testing = true
var chatSocket = null

if (testing) {
  chatSocket = io.connect('http://localhost:800')
} else {
  chatSocket = io.connect()
}

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = { menuShow: false, btnPress: -1 }
  }

  toggleMenu () {
    const { menuShow } = this.state
    if (menuShow) {
      this.setState({ menuShow: false })
    } else {
      this.setState({ menuShow: true })
    }
  }

  getSelectedBtn () {
    const { btnPress } = this.state

    switch (btnPress) {
      case -1:
        return (
          <HStack>
            <Image
              borderRadius='full'
              boxSize='75px'
              src={logo}
              alt='Bridgeware'
            />
            <Text fontSize='4xl'>Bridgeware</Text>
          </HStack>
        )
      case 1:
        return (
          <HStack>
            <Image
              borderRadius='full'
              boxSize='75px'
              src={logoCpelookup}
              alt='Cpelookup'
            />
            <Text fontSize='4xl'>Cpelookup</Text>
          </HStack>
        )
    }
  }

  render () {
    const { menuShow } = this.state

    var lstBtns = [
      ['Security', 'text', -1],
      ['Cpelookup', 'btn', 1]
    ]

    var lst = []

    for (var l in lstBtns) {
      const pressed = lstBtns[l][2]
      const txt = lstBtns[l][0]
      switch (lstBtns[l][1]) {
        case 'text':
          lst.push(
            <Text key={uuidv4()} fontSize='xs'>
              {txt}
            </Text>
          )
          break
        case 'btn':
          lst.push(
            <Button
              key={uuidv4()}
              colorScheme='blue'
              onClick={() => this.setState({ btnPress: pressed })}
            >
              <Text fontSize='xs'>{txt}</Text>
            </Button>
          )
          break
      }
    }

    var menu = (
      <Box p={2} bg='black' color='white'>
        <Stack>
          <Button
            colorScheme='blue'
            onClick={() => this.setState({ btnPress: -1 })}
          >
            <Text fontSize='xs'>Bridgeware</Text>
          </Button>
          <Stack>{lst}</Stack>
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
              <Center>{this.getSelectedBtn()}</Center>
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
