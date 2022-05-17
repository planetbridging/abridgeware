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
  Spacer,
  Input
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import * as security from './crypto'

class WindowCpelookup extends React.Component {
  state = { cpeSearch: '', cpeSearchResults: [] }
  componentDidMount () {
    this.loadSocket()
  }

  loadSocket () {
    this.props.chatSocket.on('cpeSearch', data => {
      try {
        var de = security.decrypt(this.props.sessionId, data)
        var j = JSON.parse(de)
        this.setState({ cpeSearchResults: j['lst'] })
      } catch {
        console.log('trouble reading cpe search')
      }
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

  getCpeSearchResults () {
    const { cpeSearchResults } = this.state
    var lst = []
    for (var s in cpeSearchResults) {
      const cpe = cpeSearchResults[s]['cpe']
      lst.push(
        <Box
          as={Button}
          key={uuidv4()}
          boxShadow='dark-lg'
          p='2'
          m='1'
          rounded='md'
          bg='grey.200'
          colorScheme='blue'
        >
          <Text>{cpe}</Text>
        </Box>
      )
    }
    return <div className='uiq_tbl_same_bg'>{lst}</div>
  }

  cpeSearchChange (event) {
    var name = String(event.target.value)

    var enData = security.encrypt(
      this.props.sessionId,
      JSON.stringify({ cpe: name })
    )
    this.props.chatSocket.emit('cpeSearch', enData)

    this.setState({ cpeSearch: name })
  }

  render () {
    const { cpeSearch } = this.state
    var stats = this.getStats()
    var findCpeResults = this.getCpeSearchResults()

    if (cpeSearch == '') {
      findCpeResults = <></>
    }

    return (
      <Stack>
        {stats}
        <Center>
          <Text>Search cpe Example a:apache:http_server:2.0.28</Text>
        </Center>
        <Input
          placeholder='a:apache:http_server:2.0.28'
          value={cpeSearch}
          onChange={e => this.cpeSearchChange(e)}
        />
        {findCpeResults}
      </Stack>
    )
  }
}

export default WindowCpelookup
