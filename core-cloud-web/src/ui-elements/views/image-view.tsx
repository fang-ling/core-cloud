//
//  image-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/26.
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

/**
 * A view that displays an image.
 *
 * This view renders a responsive image element using the `<picture>` element,
 * allowing for multiple source formats.
 *
 * @param urls - An array of image URLs. The last URL in the array is used as
 *               the fallback image if none of the sources match.
 * @param className - An optional class name to apply to the `<img>` element for
 *                    custom styling.
 */
export default function ImageView({
  urls,
  className
}: {
  urls: string[],
  className?: string
}) {
  return (
    <picture>
      {
        urls.slice(0, -1).map((url, index) => (
          <source
            key={index}
            srcSet={url}
            type={`image/${url.split('.').pop()?.toLowerCase()}`}
          />
        ))
      }
      <img
        src={urls[urls.length - 1]}
        className={className}
      />
    </picture>
  )
}
