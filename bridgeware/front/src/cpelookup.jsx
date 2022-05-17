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
import { v4 as uuidv4 } from 'uuid'
import * as security from './crypto'

class WindowCpelookup extends React.Component {
  state = {}
  componentDidMount () {
    this.loadSocket()
  }

  loadSocket () {
    this.props.chatSocket.on('searchCpe', data => {
      var de = security.decrypt(this.props.sessionId, data)
      console.log(de)

      //this.setState({ connectionSetup: true })
    })
  }

  getStats () {
    var cpeLvls = this.props.cpeLvls['lst']
    var lst = []
    for (var l in cpeLvls) {
      const collection = cpeLvls[l][0]
      const count = cpeLvls[l][2]
      lst.push(
        <Box
          key={uuidv4()}
          boxShadow='dark-lg'
          p='2'
          m='1'
          rounded='md'
          bg='grey.200'
        >
          <Stack>
            <Text>{collection}</Text>
            <Text>{count}</Text>
          </Stack>
        </Box>
      )
    }

    return <div className='uiq_tbl_same_bg'>{lst}</div>
  }

  render () {
    var stats = this.getStats()
    return <Stack>{stats}</Stack>
  }
}

export default WindowCpelookup
