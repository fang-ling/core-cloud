//
//  album-sheet.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/13.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

import AlbumService from "@/services/album-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useAlbumSheet({
  onCreate
}: {
  onCreate?: () => void
}) {
  const name = useBinding("")
  const artist = useBinding("")
  const genre = useBinding("")
  const year = useBinding("")
  const artworkURLs = useBinding("")
  const fields = [{
    label: "Name",
    value: name
  }, {
    label: "Artist",
    value: artist
  }, {
    label: "Genre",
    value: genre
  }, {
    label: "Year",
    value: year
  }, {
    label: "Artwork URL",
    value: artworkURLs
  }]
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* MARK: - Event handlers */
  async function createButtonDidClick() {
    setIsError(false)
    setIsLoading(true)

    const success = await AlbumService.insertAlbum({
      name: name.value,
      artist: artist.value,
      genre: genre.value,
      year: +year.value,
      artworkURLs: artworkURLs.value
    })

    setIsLoading(false)

    if (success) {
      setIsError(false)
      onCreate?.()
    } else {
      setIsError(true)
    }

    return success
  }

  return {
    name,
    artist,
    genre,
    year,
    artworkURLs,
    fields,
    isError,
    isLoading,
    createButtonDidClick
  }
}
