import { readOnlyProvider } from '../web3_providers/readOnlyProvider.js'
import { formatUnits } from 'ethers'
import { getIpfsHashFromBytes32 } from '../utils/encodingUtils/encodingUtils.js'
import { getUniqueRandomNumberFromArray } from '../utils/generalUtils/generalUtils.js'

const state = {
  indexesOfSeenShortVideos: []
}

export async function getShortVideo() {
  //throw exception if the content id is 0
  try {
    const shortVideosLibraryLength = formatUnits(await readOnlyProvider.utonomaContract.getContentLibraryLength(5), 0)
    if(state.indexesOfSeenShortVideos.length >= shortVideosLibraryLength) state.indexesOfSeenShortVideos = []
    const identifier = getUniqueRandomNumberFromArray(shortVideosLibraryLength, state.indexesOfSeenShortVideos)
    if(identifier !== null) state.indexesOfSeenShortVideos.push(identifier)
    else throw new Error('indexesOfSeenShortVideos was not reseted correctly')
    const { 
      0: authorAddress, 
      1: contentIdInBytes32, 
      2: metadata, 
      3: likes 
    } = await readOnlyProvider.utonomaContract.getContentById([identifier,5])
    const contentId = getIpfsHashFromBytes32(contentIdInBytes32)
    //if(contentId == '0x0') throw 'Content deleted'
    return {
      authorAddress,
      contentId,
      metadata,
      likes,
      utonomaIdentifier: { index: identifier, contentType: 5 }
    }
  } catch(error) {
    console.log('Error in getContentLibrary getContentById: ', error)
    return {}
  }
}


