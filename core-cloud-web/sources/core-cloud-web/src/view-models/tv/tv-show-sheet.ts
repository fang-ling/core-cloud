//
//  tv-show-sheet.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/19.
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

import TVShowService from "@/services/tv-show-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useTVShowSheet({
  onCreate
}: {
  onCreate?: () => void
}) {
  const title = useBinding("")
  const starring = useBinding("")
  const genre = useBinding("")
  const startYear = useBinding("")
  const endYear = useBinding("")
  const region = useBinding("")
  const description = useBinding("")
  const posterURLs = useBinding("")
  const artworkURLs = useBinding("")
  const titleLogoURLs = useBinding("")
  const studio = useBinding("")
  const fields = [{
    label: "Title", value: title
  }, {
    label: "Starring", value: starring
  }, {
    label: "Genre", value: genre
  }, {
    label: "Start Year", value: startYear
  }, {
    label: "End Year", value: endYear
  }, {
    label: "Regions of Origin", value: region
  }, {
    label: "Description", value: description
  }, {
    label: "Poster URL", value: posterURLs
  }, {
    label: "Artwork URL", value: artworkURLs
  }, {
    label: "Title Logo URL", value: titleLogoURLs
  }, {
    label: "Studio", value: studio
  }]
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* MARK: Event handlers */
  async function createButtonDidClick() {
    setIsError(false)
    setIsLoading(true)

    const success = await TVShowService.insertTVShow({
      title: title.value,
      starring: starring.value,
      genre: genre.value,
      startYear: +startYear.value,
      endYear: +endYear.value,
      region: region.value,
      description: description.value,
      posterURLs: posterURLs.value,
      artworkURLs: artworkURLs.value,
      titleLogoURLs: (
        titleLogoURLs.value.length > 0
          ? titleLogoURLs.value
          : undefined
      ),
      studio: studio.value
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
    title,
    starring,
    genre,
    startYear,
    endYear,
    region,
    description,
    posterURLs,
    artworkURLs,
    studio,
    fields,
    isError,
    isLoading,
    createButtonDidClick
  }
}
