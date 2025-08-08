//
//  home-background-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/4.
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

export default function HomeBackgroundView({
  color
}: {
  color?: string
}) {
  let lightColor = ''
  let darkColor = ''
  switch (color) {
    case 'blue':
      lightColor =
'after:bg-linear-[64deg,rgb(91,160,255),rgb(26,142,255)_46%,rgb(45,126,235)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(0,53,95),rgb(0,47,108)_44.5%,rgb(2,0,108)]'
      break

    case 'purple':
      lightColor =
'after:bg-linear-[64deg,rgb(132,97,199),rgb(75,42,169)_47%,rgb(93,53,183)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(31,9,67),rgb(53,21,116)_48%,rgb(33,0,86)]'
      break

    case 'green':
      lightColor =
'after:bg-linear-[64deg,rgb(66,154,66),rgb(72,185,66)_44%,rgb(19,156,28)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(3,39,0),rgb(11,51,0)_45%,rgb(13,42,0)]'
      break

    case 'red':
      lightColor =
'after:bg-linear-[64deg,rgb(228,55,50),rgb(195,41,41)_45%,rgb(219,90,90)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(54,2,0),rgb(110,21,21)_46%,rgb(92,3,3)]'
      break

    case 'orange':
      lightColor =
'after:bg-linear-[64deg,rgb(251,117,57),rgb(228,116,28)_44%,rgb(209,99,0)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(113,29,0),rgb(157,46,0)_44%,rgb(116,44,3)]'
      break

    case 'yellow':
      lightColor =
'after:bg-linear-[64deg,rgb(230,165,54),rgb(230,189,28)_45%,rgb(225,143,2)]'
      darkColor =
'dark:after:bg-linear-[64deg,rgb(72,42,9),rgb(174,95,0)_46%,rgb(113,67,0)]'
      break
  }

  return (
    <>
      <div
        className={
          'fixed dark:hidden inset-0 bg-cover w-full h-full bg-center ' +
            'after:fixed after:mix-blend-hard-light after:inset-0 ' +
            'animate-[fadeIn_.25s_ease-in] ' + (
              lightColor
            )
        }
        style={{
          backgroundImage: (
            'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53M' +
              'y5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8' +
              'xOTk5L3hsaW5rIiB3aWR0aD0iMTc0OSIgaGVpZ2h0PSI4NjkiPjxkZWZzPjxwY' +
              'XRoIGlkPSJiIiBkPSJNMTE4NC45NzcgMzI1LjQ4NEM4OTkuNDYgMTExLjg4NCA' +
              '1MTguMjggNzAuMTQzIDE5NC40NzMgMjExLjkxYy0yNy44MTktNTQuNDA4LTY0L' +
              'jc2NS0xMDQtMTA5LjAyMi0xNDUuOTI0QzcwLjI0MyA1MS41NjEgNTMuOTE0IDM' +
              '3LjggMzYuOTI2IDI1LjA5IDI1LjQ4OSAxNi41MzIgMTMuMjk5IDguMjQ4IDAgM' +
              'HY4NjAuNjQyaDE1NDcuNTNjLTU1LjU4OC0yMDYuNzk1LTE3OC4yMTgtMzk3LjI' +
              '1Ni0zNjIuNTUzLTUzNS4xNTgiLz48cGF0aCBpZD0iZiIgZD0iTTAgODY4Ljc0M' +
              '2gxMjcwLjU0MUMxMjYxLjEyMSA1NDUuNTU2IDExMjMuMzQ4IDIyOC4zMTYgODY' +
              '5LjQ2NiAwSDB6Ii8+PHBhdGggaWQ9ImsiIGQ9Ik0wIDg2OC43NDNoOTc1Ljk4M' +
              'kM5NDUuNDg3IDUzOC4xNDggNzgwLjQ5MiAyMjAuNzcxIDQ5NC4yNzQgNi42NDh' +
              'BMTA3NSAxMDc1IDAgMCAwIDQ4NS4yOTcgMEgweiIvPjxwYXRoIGlkPSJwIiBkP' +
              'SJNMzg5LjIxNSAxNzUuMzE1QzI3Mi4wNiA4Ny42NyAxMzguNzk1IDI4Ljk2OCA' +
              'wIDB2ODE0Ljc3Nmg3NzMuOTAxQzczNS4yNCA1NjguNDQyIDYwNC4xODUgMzM2L' +
              'jE0MSAzODkuMjE1IDE3NS4zMTUiLz48cGF0aCBpZD0iciIgZD0iTTU1MC44OTQ' +
              'gMzQ2LjczNEM0MDkuNzY2IDE2OS41NTcgMjEzLjczNCA0OS43MSAwIDB2NDEyL' +
              'jE5OGg1OTguODI2YTk5OSA5OTkgMCAwIDAtNDcuOTMyLTY1LjQ2eiIvPjxwYXR' +
              'oIGlkPSJ0IiBkPSJNMCA4NjguNzQzaDEyNzAuNTQxQzEyNjEuMTIxIDU0NS41N' +
              'TYgMTEyMy4zNDggMjI4LjMxNiA4NjkuNDY2IDBIMHoiLz48cGF0aCBpZD0idyI' +
              'gZD0iTTM4OS4yMTUgMTc1LjMxNUMyNzIuMDYgODcuNjcgMTM4Ljc5NSAyOC45N' +
              'jggMCAwdjgxNC43NzZoNzczLjkwMUM3MzUuMjQgNTY4LjQ0MiA2MDQuMTg1IDM' +
              'zNi4xNDEgMzg5LjIxNSAxNzUuMzE1Ii8+PHBhdGggaWQ9InoiIGQ9Ik01NTAuO' +
              'Dk0IDM0Ni43MzRDNDA5Ljc2NiAxNjkuNTU3IDIxMy43MzQgNDkuNzEgMCAwdjQ' +
              'xMi4xOThoNTk4LjgyNmE5OTkgOTk5IDAgMCAwLTQ3LjkzMi02NS40NnoiLz48c' +
              'GF0aCBpZD0iQSIgZD0iTTU1MC44OTQgMzQ2LjczNEM0MDkuNzY2IDE2OS41NTc' +
              'gMjEzLjczNCA0OS43MSAwIDB2NDEyLjE5OGg1OTguODI2YTk5OSA5OTkgMCAwI' +
              'DAtNDcuOTMyLTY1LjQ2eiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjA' +
              'lIiB4Mj0iMTAwJSIgeTE9IjUwJSIgeTI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJ' +
              'SIgc3RvcC1jb2xvcj0iI0ZGRiIvPjxzdG9wIG9mZnNldD0iNTElIiBzdG9wLWN' +
              'vbG9yPSIjRDBEMEQwIi8+PHN0b3Agb2Zmc2V0PSI2MiUiIHN0b3AtY29sb3I9I' +
              'iNDNEM0QzQiLz48c3RvcCBvZmZzZXQ9IjY4JSIgc3RvcC1jb2xvcj0iI0JDQkN' +
              'CQyIvPjxzdG9wIG9mZnNldD0iNzYlIiBzdG9wLWNvbG9yPSIjQUVBRUFFIi8+P' +
              'HN0b3Agb2Zmc2V0PSI4NyUiIHN0b3AtY29sb3I9IiM5MjkyOTIiLz48c3RvcCB' +
              'vZmZzZXQ9Ijk0JSIgc3RvcC1jb2xvcj0iIzdCN0I3QiIvPjxzdG9wIG9mZnNld' +
              'D0iMTAwJSIgc3RvcC1jb2xvcj0iIzcwNzA3MCIvPjwvbGluZWFyR3JhZGllbnQ' +
              '+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNzcuNDU3JSIgeDI9IjkxLjA2N' +
              'iUiIHkxPSI0OC40MzElIiB5Mj0iNjUuNDY1JSI+PHN0b3Agb2Zmc2V0PSIwJSI' +
              'gc3RvcC1jb2xvcj0iIzVENUQ1RCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3Rvc' +
              'C1jb2xvcj0iIzU0NTQ1NCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWR' +
              'pZW50IGlkPSJnIiB4MT0iNTAlIiB4Mj0iOTAuNjI4JSIgeTE9IjI2LjYyNCUiI' +
              'HkyPSI3My4zNzYlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQTF' +
              'BMEEwIi8+PHN0b3Agb2Zmc2V0PSI1My4xMDYlIiBzdG9wLWNvbG9yPSIjNkU2R' +
              'TZFIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzkzOTM5Ii8' +
              '+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImgiIHgxPSI1M' +
              'CUiIHgyPSI5MC43NzclIiB5MT0iMjYuNjI0JSIgeTI9IjczLjM3NiUiPjxzdG9' +
              'wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM3RDdEN0QiLz48c3RvcCBvZmZzZ' +
              'XQ9IjUzLjg3MiUiIHN0b3AtY29sb3I9IiM3NTc1NzUiLz48c3RvcCBvZmZzZXQ' +
              '9IjEwMCUiIHN0b3AtY29sb3I9IiM3MTcxNzEiLz48L2xpbmVhckdyYWRpZW50P' +
              'jxsaW5lYXJHcmFkaWVudCBpZD0ibCIgeDE9IjAlIiB4Mj0iNzguODI2JSIgeTE' +
              '9IjEwLjM4NCUiIHkyPSI4OS4yNzglIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wL' +
              'WNvbG9yPSIjRThFN0U3Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9' +
              'yPSIjODI4MjgyIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQga' +
              'WQ9Im0iIHgxPSIwJSIgeDI9Ijc5LjE2MyUiIHkxPSIxMC4zODQlIiB5Mj0iODk' +
              'uNjE2JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzlFOUU5RSIvP' +
              'jxzdG9wIG9mZnNldD0iNTAuNDM1JSIgc3RvcC1jb2xvcj0iI0EwQTBBMCIvPjx' +
              'zdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzhGOEY4RiIvPjwvbGluZ' +
              'WFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJxIiB4MT0iNC44OTElIiB' +
              '4Mj0iODIuODI1JSIgeTE9IjE1LjMyNiUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZ' +
              'XQ9IjAlIiBzdG9wLWNvbG9yPSIjQjlCOUI5Ii8+PHN0b3Agb2Zmc2V0PSIxMDA' +
              'lIiBzdG9wLWNvbG9yPSIjQjVCNUI1Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZ' +
              'WFyR3JhZGllbnQgaWQ9InMiIHgxPSIwJSIgeDI9Ijc3LjM4NiUiIHkxPSIzNy4' +
              '5ODglIiB5Mj0iNzMuNjkxJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvc' +
              'j0iI0NGQ0VDRSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0M' +
              '2QzZDNiIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJkI' +
              'iBjeD0iNDYuMDYyJSIgY3k9IjEyMC4xNjQlIiByPSI5OS4xMjYlIiBmeD0iNDY' +
              'uMDYyJSIgZnk9IjEyMC4xNjQlIiBncmFkaWVudFRyYW5zZm9ybT0ic2NhbGUoL' +
              'jU1NjEgMSlyb3RhdGUoLTMxLjAwOSAuNjQ0IC41MzkpIj48c3RvcCBvZmZzZXQ' +
              '9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3Rvc' +
              'CBvZmZzZXQ9IjY5LjgwNCUiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnN' +
              'ldD0iODUuOTk3JSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuM' +
              'DgyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9' +
              'wLW9wYWNpdHk9Ii4yNTMiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFka' +
              'WVudCBpZD0iaSIgY3g9IjE5LjA0MSUiIGN5PSI5OC4zNDIlIiByPSIxMTcuNjA' +
              '0JSIgZng9IjE5LjA0MSUiIGZ5PSI5OC4zNDIlIiBncmFkaWVudFRyYW5zZm9yb' +
              'T0ic2NhbGUoLjY4MzggMSlyb3RhdGUoLTE5LjA1MyAuMjM0IC43MjEpIj48c3R' +
              'vcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9I' +
              'jAiLz48c3RvcCBvZmZzZXQ9IjgzLjU2NCUiIHN0b3AtY29sb3I9IiNGRkYiIHN' +
              '0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iOTAuMjgxJSIgc3RvcC1jb' +
              '2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMDQiLz48c3RvcCBvZmZzZXQ9IjE' +
              'wMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjE5Ii8+PC9yY' +
              'WRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9Im4iIGN4PSItMjEuMDg' +
              '5JSIgY3k9IjExMC45ODQlIiByPSIxMzYuMzklIiBmeD0iLTIxLjA4OSUiIGZ5P' +
              'SIxMTAuOTg0JSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguNzM4MjcgLS4' +
              '1NTg2MiAuNDk3MjIgLjgyOTQzIC0uNjA3IC4wNzEpIj48c3RvcCBvZmZzZXQ9I' +
              'jAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCB' +
              'vZmZzZXQ9IjkyLjk3JSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5P' +
              'SIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9' +
              'wLW9wYWNpdHk9Ii4xNSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZ' +
              'W50IGlkPSJ1IiBjeD0iMy41OTclIiBjeT0iMTA0LjY2OCUiIHI9IjE0Mi4xOTE' +
              'lIiBmeD0iMy41OTclIiBmeT0iMTA0LjY2OCUiIGdyYWRpZW50VHJhbnNmb3JtP' +
              'SJzY2FsZSguNjgzOCAxKXJvdGF0ZSgtMzEuMTkgLjA0NCAxLjAxNykiPjxzdG9' +
              'wIG9mZnNldD0iMCUiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iO' +
              'DYuMTA3JSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN' +
              '0b3Agb2Zmc2V0PSI5Mi4yOCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY' +
              '2l0eT0iLjA0Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZ' +
              'GIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR' +
              '3JhZGllbnQgaWQ9IngiIGN4PSItMjIuNTAyJSIgY3k9IjExNS42MzQlIiByPSI' +
              'xMjQuMzY1JSIgZng9Ii0yMi41MDIlIiBmeT0iMTE1LjYzNCUiIGdyYWRpZW50V' +
              'HJhbnNmb3JtPSJtYXRyaXgoLjcxMjkzIC0uNjY2MDQgLjcwMTI0IC42NzcxNCA' +
              'tLjg3NSAuMjIzKSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGR' +
              'iIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSI3NC45MTYlIiBzdG9' +
              'wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjgzLjMwNCUiIHN0b3AtY29sb' +
              '3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjAyIi8+PHN0b3Agb2Zmc2V0PSIxMDA' +
              'lIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIi8+PC9yYWRpY' +
              'WxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IkIiIGN4PSItMzIuMDc2JSI' +
              'gY3k9IjIyMy4xMzYlIiByPSIyMjkuNzA4JSIgZng9Ii0zMi4wNzYlIiBmeT0iM' +
              'jIzLjEzNiUiIGdyYWRpZW50VHJhbnNmb3JtPSJzY2FsZSguNjg4MyAxKXJvdGF' +
              '0ZSgtNTUuOTkyIC0uMzkzIDIuMzY4KSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3Rvc' +
              'C1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSI' +
              '2OC44MzclIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiI' +
              'HN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjMxIi8+PC9yYWRpYWx' +
              'HcmFkaWVudD48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub' +
              '2RkIj48ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6b3ZlcmxheSI+PHBhdGggZml' +
              'sbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMCAwaDE3NDl2O' +
              'DY4LjgyOUgweiIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgOC4xKSI+PG1' +
              'hc2sgaWQ9ImUiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L' +
              '21hc2s+PHVzZSB4bGluazpocmVmPSIjYiIgZmlsbD0idXJsKCNjKSIvPjxwYXR' +
              'oIGZpbGw9InVybCgjZCkiIGQ9Ik0xMTg0Ljk3NyAzMjUuNDg0Qzg5OS40NiAxM' +
              'TEuODg0IDUxOC4yOCA3MC4xNDMgMTk0LjQ3MyAyMTEuOTFjLTI3LjgxOS01NC4' +
              '0MDgtNjQuNzY1LTEwNC0xMDkuMDIyLTE0NS45MjRDNzAuMjQzIDUxLjU2MSA1M' +
              'y45MTQgMzcuOCAzNi45MjYgMjUuMDkgMjUuNDg5IDE2LjUzMiAxMy4yOTkgOC4' +
              'yNDggMCAwdjg2MC42NDJoMTU0Ny41M2MtNTUuNTg4LTIwNi43OTUtMTc4LjIxO' +
              'C0zOTcuMjU2LTM2Mi41NTMtNTM1LjE1OCIgbWFzaz0idXJsKCNlKSIvPjwvZz4' +
              '8bWFzayBpZD0iaiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjZiIvP' +
              'jwvbWFzaz48dXNlIHhsaW5rOmhyZWY9IiNmIiBmaWxsPSJ1cmwoI2cpIi8+PHV' +
              'zZSB4bGluazpocmVmPSIjZiIgZmlsbD0idXJsKCNoKSIvPjxwYXRoIGZpbGw9I' +
              'nVybCgjaSkiIGQ9Ik0wIDg2OC43NDNoMTI3MC41NDFDMTI2MS4xMjEgNTQ1LjU' +
              '1NiAxMTIzLjM0OCAyMjguMzE2IDg2OS40NjYgMEgweiIgbWFzaz0idXJsKCNqK' +
              'SIvPjxtYXNrIGlkPSJvIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiN' +
              'rIi8+PC9tYXNrPjx1c2UgeGxpbms6aHJlZj0iI2siIGZpbGw9InVybCgjbCkiL' +
              'z48dXNlIHhsaW5rOmhyZWY9IiNrIiBmaWxsPSJ1cmwoI20pIi8+PHBhdGggZml' +
              'sbD0idXJsKCNuKSIgZD0iTTAgODY4Ljc0M2g5NzUuOTgyQzk0NS40ODcgNTM4L' +
              'jE0OCA3ODAuNDkyIDIyMC43NzEgNDk0LjI3NCA2LjY0OEExMDc1IDEwNzUgMCA' +
              'wIDAgNDg1LjI5NyAwSDB6IiBtYXNrPSJ1cmwoI28pIi8+PHVzZSB4bGluazpoc' +
              'mVmPSIjcCIgZmlsbD0idXJsKCNxKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA' +
              '1My45NjcpIi8+PHVzZSB4bGluazpocmVmPSIjciIgZmlsbD0idXJsKCNzKSIgd' +
              'HJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA0NTYuNTQ4KSIvPjwvZz48bWFzayBpZD0' +
              'idiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjdCIvPjwvbWFzaz48c' +
              'GF0aCBmaWxsPSJ1cmwoI3UpIiBkPSJNMCA4NjguNzQzaDEyNzAuNTQxQzEyNjE' +
              'uMTIxIDU0NS41NTYgMTEyMy4zNDggMjI4LjMxNiA4NjkuNDY2IDBIMHoiIG1hc' +
              '2s9InVybCgjdikiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDUzLjk2Nyk' +
              'iPjxtYXNrIGlkPSJ5IiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiN3I' +
              'i8+PC9tYXNrPjxwYXRoIGZpbGw9InVybCgjeCkiIGQ9Ik0zODkuMjE1IDE3NS4' +
              'zMTVDMjcyLjA2IDg3LjY3IDEzOC43OTUgMjguOTY4IDAgMHY4MTQuNzc2aDc3M' +
              'y45MDFDNzM1LjI0IDU2OC40NDIgNjA0LjE4NSAzMzYuMTQxIDM4OS4yMTUgMTc' +
              '1LjMxNSIgbWFzaz0idXJsKCN5KSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zb' +
              'GF0ZSgwIDQ1Ni41NDgpIj48dXNlIHhsaW5rOmhyZWY9IiNBIiBmaWxsPSJ1cmw' +
              'oI0IpIi8+PC9nPjwvZz48L3N2Zz4=")'
          )
        }}
      />
      <div
        className={
          'fixed a1bsolute hidden dark:block inset-0 bg-cover w-full ' +
            'bg-center after:fixed after:mix-blend-hard-light h-screen ' +
            'after:inset-0 animate-[fadeIn_.25s_ease-in] ' + (
              darkColor
            )
        }
        style={{
          backgroundImage: (
            'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53M' +
              'y5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8' +
              'xOTk5L3hsaW5rIiB3aWR0aD0iMTc0OSIgaGVpZ2h0PSI4NjkiPjxkZWZzPjxyY' +
              'WRpYWxHcmFkaWVudCBpZD0iZCIgY3g9IjQ2LjA2MiUiIGN5PSIxMjAuMTYyJSI' +
              'gcj0iOTkuMTIxJSIgZng9IjQ2LjA2MiUiIGZ5PSIxMjAuMTYyJSIgZ3JhZGllb' +
              'nRUcmFuc2Zvcm09InNjYWxlKC41NTYxIDEpcm90YXRlKC0zMS4wMSAuNjQ0IC4' +
              '1MzkpIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wL' +
              'W9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjY2LjU3MiUiIHN0b3Atb3BhY2l' +
              '0eT0iMCIvPjxzdG9wIG9mZnNldD0iODQuNDMxJSIgc3RvcC1jb2xvcj0iI0ZGR' +
              'iIgc3RvcC1vcGFjaXR5PSIuMDgyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9' +
              'wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yNTMiLz48L3JhZGlhbEdyY' +
              'WRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaCIgY3g9IjE5LjA0MSUiIGN5PSI' +
              '5OC4zNDElIiByPSIxMTcuNjExJSIgZng9IjE5LjA0MSUiIGZ5PSI5OC4zNDElI' +
              'iBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC42NDYzNCAtLjMyNjQyIC4yMjM' +
              'yIC45NDUyMiAtLjE1MiAuMTE2KSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb' +
              '2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSI3Ny4' +
              '2NzclIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3Rvc' +
              'CBvZmZzZXQ9Ijg3Ljg1MSUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l' +
              '0eT0iLjA4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGI' +
              'iBzdG9wLW9wYWNpdHk9Ii4yNSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEd' +
              'yYWRpZW50IGlkPSJsIiBjeD0iLTIxLjA4NyUiIGN5PSIxMTAuOTgyJSIgcj0iM' +
              'TM2LjM4OCUiIGZ4PSItMjEuMDg3JSIgZnk9IjExMC45ODIlIiBncmFkaWVudFR' +
              'yYW5zZm9ybT0ic2NhbGUoLjg5MDEgMSlyb3RhdGUoLTMzLjk2MSAtLjIyNCAxL' +
              'jE1MikiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3A' +
              'tb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iNzcuMyUiIHN0b3AtY29sb3I9I' +
              'iNGQ0ZDRkMiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iODQuMDQ' +
              '0JSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb' +
              '2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4' +
              'yMjUiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icCIgY' +
              '3g9Ii0xOC44NDMlIiBjeT0iMTEyLjA3MSUiIHI9IjEyMC4xNDYlIiBmeD0iLTE' +
              '4Ljg0MyUiIGZ5PSIxMTIuMDcxJSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpe' +
              'CguNzAzMDQgLS42NzU0NSAuNzExMTUgLjY2Nzc1IC0uODUzIC4yNDUpIj48c3R' +
              'vcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9I' +
              'jAiLz48c3RvcCBvZmZzZXQ9IjU5LjU1NyUiIHN0b3Atb3BhY2l0eT0iMCIvPjx' +
              'zdG9wIG9mZnNldD0iODQuMjEzJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vc' +
              'GFjaXR5PSIuMTAyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSI' +
              'jRkZGIiBzdG9wLW9wYWNpdHk9Ii4zMDEiLz48L3JhZGlhbEdyYWRpZW50PjxyY' +
              'WRpYWxHcmFkaWVudCBpZD0icyIgY3g9Ii0xOS45MDIlIiBjeT0iMTk4LjUyOSU' +
              'iIHI9IjIwMC4zNTclIiBmeD0iLTE5LjkwMiUiIGZ5PSIxOTguNTI5JSIgZ3JhZ' +
              'GllbnRUcmFuc2Zvcm09Im1hdHJpeCguMzgxNzYgLS44MzIxIC41NzI3MyAuNTU' +
              '0NjQgLTEuMjYgLjcxOSkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9I' +
              'iNGRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iODQuODY3JSI' +
              'gc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc' +
              '2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIi8+PC9yYWRpYWxHcmFkaWVudD4' +
              '8cmFkaWFsR3JhZGllbnQgaWQ9InUiIGN4PSIzLjU5OCUiIGN5PSIxMDQuNjclI' +
              'iByPSIxNDIuMTk3JSIgZng9IjMuNTk4JSIgZnk9IjEwNC42NyUiIGdyYWRpZW5' +
              '0VHJhbnNmb3JtPSJzY2FsZSguNjgzOCAxKXJvdGF0ZSgtMzEuMTg4IC4wNDQgM' +
              'S4wMTcpIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9' +
              'wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ijg1LjU2NiUiIHN0b3AtY29sb' +
              '3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMTAwJSI' +
              'gc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMDIiLz48L3JhZGlhb' +
              'EdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0ieCIgY3g9Ii0yMS4wODclIiB' +
              'jeT0iMTEwLjk4MiUiIHI9IjEzNi4zODglIiBmeD0iLTIxLjA4NyUiIGZ5PSIxM' +
              'TAuOTgyJSIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKC44OTAxIDEpcm90YXR' +
              'lKC0zMy45NjEgLS4yMjQgMS4xNTIpIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wL' +
              'WNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ijg' +
              '2LjkxNCUiIHN0b3AtY29sb3I9IiNGQ0ZDRkMiIHN0b3Atb3BhY2l0eT0iMCIvP' +
              'jxzdG9wIG9mZnNldD0iOTUuMjExJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1' +
              'vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjR' +
              'kZGIiBzdG9wLW9wYWNpdHk9Ii4wMyIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGl' +
              'hbEdyYWRpZW50IGlkPSJBIiBjeD0iLTIyLjQ5OCUiIGN5PSIxMTUuNjM0JSIgc' +
              'j0iMTI0LjM2MyUiIGZ4PSItMjIuNDk4JSIgZnk9IjExNS42MzQlIiBncmFkaWV' +
              'udFRyYW5zZm9ybT0ibWF0cml4KC43MTI5NCAtLjY2NjAyIC43MDEyMyAuNjc3M' +
              'TUgLS44NzUgLjIyMykiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiN' +
              'GRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iODIuMzclIiBzd' +
              'G9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ijk1Ljk4OCUiIHN0b3AtY29' +
              'sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjAyIi8+PHN0b3Agb2Zmc2V0PSIxM' +
              'DAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4wMyIvPjwvcmF' +
              'kaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJDIiBjeD0iLTMyLjA4J' +
              'SIgY3k9IjIyMy4xMzQlIiByPSIyMjkuNzA0JSIgZng9Ii0zMi4wOCUiIGZ5PSI' +
              'yMjMuMTM0JSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMzg0OTUgLS44M' +
              'jg5OCAuNTcwNTkgLjU1OTI4IC0xLjQ3IC43MTcpIj48c3RvcCBvZmZzZXQ9IjA' +
              'lIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZ' +
              'mZzZXQ9IjY5LjA5OCUiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0' +
              'iODUuMDAzJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMDIiL' +
              'z48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3B' +
              'hY2l0eT0iLjEiLz48L3JhZGlhbEdyYWRpZW50PjxwYXRoIGlkPSJjIiBkPSJNM' +
              'TE4NC45NzcgMzI1LjQ4NEM4OTkuNDYgMTExLjg4NCA1MTguMjggNzAuMTQzIDE' +
              '5NC40NzMgMjExLjkxYy0yNy44MTktNTQuNDA4LTY0Ljc2NS0xMDQtMTA5LjAyM' +
              'i0xNDUuOTI0QzcwLjI0MyA1MS41NjEgNTMuOTE0IDM3LjggMzYuOTI2IDI1LjA' +
              '5IDI1LjQ4OSAxNi41MzIgMTMuMjk5IDguMjQ4IDAgMHY4NjAuNjQyaDE1NDcuN' +
              'TNjLTU1LjU4OC0yMDYuNzk1LTE3OC4yMTgtMzk3LjI1Ni0zNjIuNTUzLTUzNS4' +
              'xNTgiLz48cGF0aCBpZD0iZyIgZD0iTTAgODY4Ljc0M2gxMjcwLjU0MUMxMjYxL' +
              'jEyMSA1NDUuNTU2IDExMjMuMzQ4IDIyOC4zMTYgODY5LjQ2NiAwSDB6Ii8+PHB' +
              'hdGggaWQ9ImsiIGQ9Ik0wIDg2OC43NDNoOTc1Ljk4MkM5NDUuNDg3IDUzOC4xN' +
              'DggNzgwLjQ5MiAyMjAuNzcxIDQ5NC4yNzQgNi42NDhBMTA3NSAxMDc1IDAgMCA' +
              'wIDQ4NS4yOTcgMEgweiIvPjxwYXRoIGlkPSJvIiBkPSJNMzg5LjIxNSAxNzUuM' +
              'zE1QzI3Mi4wNiA4Ny42NyAxMzguNzk1IDI4Ljk2OCAwIDB2ODE0Ljc3Nmg3NzM' +
              'uOTAxQzczNS4yNCA1NjguNDQyIDYwNC4xODUgMzM2LjE0MSAzODkuMjE1IDE3N' +
              'S4zMTUiLz48cGF0aCBpZD0idCIgZD0iTTAgODY4Ljc0M2gxMjcwLjU0MUMxMjY' +
              'xLjEyMSA1NDUuNTU2IDExMjMuMzQ4IDIyOC4zMTYgODY5LjQ2NiAwSDB6Ii8+P' +
              'HBhdGggaWQ9InciIGQ9Ik0wIDg2OC43NDNoOTc1Ljk4MkM5NDUuNDg3IDUzOC4' +
              'xNDggNzgwLjQ5MiAyMjAuNzcxIDQ5NC4yNzQgNi42NDhBMTA3NSAxMDc1IDAgM' +
              'CAwIDQ4NS4yOTcgMEgweiIvPjxwYXRoIGlkPSJ6IiBkPSJNMzg5LjIxNSAxNzU' +
              'uMzE1QzI3Mi4wNiA4Ny42NyAxMzguNzk1IDI4Ljk2OCAwIDB2ODE0Ljc3Nmg3N' +
              'zMuOTAxQzczNS4yNCA1NjguNDQyIDYwNC4xODUgMzM2LjE0MSAzODkuMjE1IDE' +
              '3NS4zMTUiLz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeDI9IjEwM' +
              'CUiIHkxPSI1MCUiIHkyPSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29' +
              'sb3I9IiNGRkYiLz48c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iI0QwR' +
              'DBEMCIvPjxzdG9wIG9mZnNldD0iNjIlIiBzdG9wLWNvbG9yPSIjQzRDNEM0Ii8' +
              '+PHN0b3Agb2Zmc2V0PSI2OCUiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3Rvc' +
              'CBvZmZzZXQ9Ijc2JSIgc3RvcC1jb2xvcj0iI0FFQUVBRSIvPjxzdG9wIG9mZnN' +
              'ldD0iODclIiBzdG9wLWNvbG9yPSIjOTI5MjkyIi8+PHN0b3Agb2Zmc2V0PSI5N' +
              'CUiIHN0b3AtY29sb3I9IiM3QjdCN0IiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN' +
              '0b3AtY29sb3I9IiM3MDcwNzAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHc' +
              'mFkaWVudCBpZD0iYiIgeDE9Ijc3LjQ1NyUiIHgyPSI5MS4wNjYlIiB5MT0iNDg' +
              'uNDMxJSIgeTI9IjY1LjQ2NSUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb' +
              '3I9IiM1RDVENUQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM' +
              'zMzMiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZiIge' +
              'DE9IjUwJSIgeDI9IjkwLjYyOCUiIHkxPSIyNi42MjQlIiB5Mj0iNzMuMzc2JSI' +
              '+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ExQTBBMCIvPjxzdG9wI' +
              'G9mZnNldD0iNTIuODA1JSIgc3RvcC1jb2xvcj0iIzZFNkU2RSIvPjxzdG9wIG9' +
              'mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRCNEI0QiIvPjwvbGluZWFyR3JhZ' +
              'GllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJqIiB4MT0iMCUiIHgyPSI3OC44MjY' +
              'lIiB5MT0iMTAuMzg0JSIgeTI9Ijg5LjI3OCUiPjxzdG9wIG9mZnNldD0iMCUiI' +
              'HN0b3AtY29sb3I9IiNFOEU3RTciLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3A' +
              'tY29sb3I9IiM4MjgyODIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFka' +
              'WVudCBpZD0ibiIgeDE9IjQuODkxJSIgeDI9IjUwJSIgeTE9IjAlIiB5Mj0iMTA' +
              'wJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0U2RTZFNiIvPjxzd' +
              'G9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0QxRDFEMSIvPjwvbGluZWF' +
              'yR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJyIiB4MT0iMCUiIHgyPSI1M' +
              'CUiIHkxPSIyNi4zMDklIiB5Mj0iNzMuNjkxJSI+PHN0b3Agb2Zmc2V0PSIwJSI' +
              'gc3RvcC1jb2xvcj0iI0ZGRiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb' +
              '2xvcj0iI0VFRSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5' +
              'vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgc3R5bGU9Im1peC1ibGVuZC1tb' +
              '2RlOm92ZXJsYXkiPjxwYXRoIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0ibm9' +
              'uemVybyIgZD0iTTAgMGgxNzQ5djg2OC44MjlIMHoiLz48cGF0aCBmaWxsPSJ1c' +
              'mwoI2IpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xMTg0Ljk3NyAzMjUuNDg' +
              '0Qzg5OS40NiAxMTEuODg0IDUxOC4yOCA3MC4xNDMgMTk0LjQ3MyAyMTEuOTFjL' +
              'TI3LjgxOS01NC40MDgtNjQuNzY1LTEwNC0xMDkuMDIyLTE0NS45MjRDNzAuMjQ' +
              'zIDUxLjU2MSA1My45MTQgMzcuOCAzNi45MjYgMjUuMDkgMjUuNDg5IDE2LjUzM' +
              'iAxMy4yOTkgOC4yNDggMCAwdjg2MC42NDJoMTU0Ny41M2MtNTUuNTg4LTIwNi4' +
              '3OTUtMTc4LjIxOC0zOTcuMjU2LTM2Mi41NTMtNTM1LjE1OCIgdHJhbnNmb3JtP' +
              'SJ0cmFuc2xhdGUoMCA4LjEpIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA' +
              '4LjEpIj48bWFzayBpZD0iZSIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmP' +
              'SIjYyIvPjwvbWFzaz48cGF0aCBmaWxsPSJ1cmwoI2QpIiBmaWxsLXJ1bGU9Im5' +
              'vbnplcm8iIGQ9Ik0xMTg0Ljk3NyAzMjUuNDg0Qzg5OS40NiAxMTEuODg0IDUxO' +
              'C4yOCA3MC4xNDMgMTk0LjQ3MyAyMTEuOTFjLTI3LjgxOS01NC40MDgtNjQuNzY' +
              '1LTEwNC0xMDkuMDIyLTE0NS45MjRDNzAuMjQzIDUxLjU2MSA1My45MTQgMzcuO' +
              'CAzNi45MjYgMjUuMDkgMjUuNDg5IDE2LjUzMiAxMy4yOTkgOC4yNDggMCAwdjg' +
              '2MC42NDJoMTU0Ny41M2MtNTUuNTg4LTIwNi43OTUtMTc4LjIxOC0zOTcuMjU2L' +
              'TM2Mi41NTMtNTM1LjE1OCIgbWFzaz0idXJsKCNlKSIvPjwvZz48cGF0aCBmaWx' +
              'sPSJ1cmwoI2YpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0wIDg2OC43NDNoM' +
              'TI3MC41NDFDMTI2MS4xMjEgNTQ1LjU1NiAxMTIzLjM0OCAyMjguMzE2IDg2OS4' +
              '0NjYgMEgweiIvPjxtYXNrIGlkPSJpIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rO' +
              'mhyZWY9IiNnIi8+PC9tYXNrPjxwYXRoIGZpbGw9InVybCgjaCkiIGZpbGwtcnV' +
              'sZT0ibm9uemVybyIgZD0iTTAgODY4Ljc0M2gxMjcwLjU0MUMxMjYxLjEyMSA1N' +
              'DUuNTU2IDExMjMuMzQ4IDIyOC4zMTYgODY5LjQ2NiAwSDB6IiBtYXNrPSJ1cmw' +
              'oI2kpIi8+PHBhdGggZmlsbD0idXJsKCNqKSIgZmlsbC1ydWxlPSJub256ZXJvI' +
              'iBkPSJNMCA4NjguNzQzaDk3NS45ODJDOTQ1LjQ4NyA1MzguMTQ4IDc4MC40OTI' +
              'gMjIwLjc3MSA0OTQuMjc0IDYuNjQ4QTEwNzUgMTA3NSAwIDAgMCA0ODUuMjk3I' +
              'DBIMHoiLz48bWFzayBpZD0ibSIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmV' +
              'mPSIjayIvPjwvbWFzaz48cGF0aCBmaWxsPSJ1cmwoI2wpIiBmaWxsLXJ1bGU9I' +
              'm5vbnplcm8iIGQ9Ik0wIDg2OC43NDNoOTc1Ljk4MkM5NDUuNDg3IDUzOC4xNDg' +
              'gNzgwLjQ5MiAyMjAuNzcxIDQ5NC4yNzQgNi42NDhBMTA3NSAxMDc1IDAgMCAwI' +
              'DQ4NS4yOTcgMEgweiIgbWFzaz0idXJsKCNtKSIvPjxwYXRoIGZpbGw9InVybCg' +
              'jbikiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTM4OS4yMTUgMTc1LjMxNUMyN' +
              'zIuMDYgODcuNjcgMTM4Ljc5NSAyOC45NjggMCAwdjgxNC43NzZoNzczLjkwMUM' +
              '3MzUuMjQgNTY4LjQ0MiA2MDQuMTg1IDMzNi4xNDEgMzg5LjIxNSAxNzUuMzE1I' +
              'iB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDUzLjk2NykiLz48ZyB0cmFuc2Zvcm0' +
              '9InRyYW5zbGF0ZSgwIDUzLjk2NykiPjxtYXNrIGlkPSJxIiBmaWxsPSIjZmZmI' +
              'j48dXNlIHhsaW5rOmhyZWY9IiNvIi8+PC9tYXNrPjxwYXRoIGZpbGw9InVybCg' +
              'jcCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTM4OS4yMTUgMTc1LjMxNUMyN' +
              'zIuMDYgODcuNjcgMTM4Ljc5NSAyOC45NjggMCAwdjgxNC43NzZoNzczLjkwMUM' +
              '3MzUuMjQgNTY4LjQ0MiA2MDQuMTg1IDMzNi4xNDEgMzg5LjIxNSAxNzUuMzE1I' +
              'iBtYXNrPSJ1cmwoI3EpIi8+PC9nPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHB' +
              'hdGggZmlsbD0idXJsKCNyKSIgZD0iTTU1MC44OTQgMzQ2LjczNEM0MDkuNzY2I' +
              'DE2OS41NTcgMjEzLjczNCA0OS43MSAwIDB2NDEyLjE5OGg1OTguODI2YTk5OSA' +
              '5OTkgMCAwIDAtNDcuOTMyLTY1LjQ2eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoM' +
              'CA0NTYuNTQ4KSIvPjxwYXRoIGZpbGw9InVybCgjcykiIGQ9Ik01NTAuODk0IDM' +
              '0Ni43MzRDNDA5Ljc2NiAxNjkuNTU3IDIxMy43MzQgNDkuNzEgMCAwdjQxMi4xO' +
              'ThoNTk4LjgyNmE5OTkgOTk5IDAgMCAwLTQ3LjkzMi02NS40NnoiIHRyYW5zZm9' +
              'ybT0idHJhbnNsYXRlKDAgNDU2LjU0OCkiLz48L2c+PC9nPjxtYXNrIGlkPSJ2I' +
              'iBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiN0Ii8+PC9tYXNrPjxwYXR' +
              'oIGZpbGw9InVybCgjdSkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTAgODY4L' +
              'jc0M2gxMjcwLjU0MUMxMjYxLjEyMSA1NDUuNTU2IDExMjMuMzQ4IDIyOC4zMTY' +
              'gODY5LjQ2NiAwSDB6IiBtYXNrPSJ1cmwoI3YpIi8+PG1hc2sgaWQ9InkiIGZpb' +
              'Gw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI3ciLz48L21hc2s+PHBhdGggZml' +
              'sbD0idXJsKCN4KSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMCA4NjguNzQza' +
              'Dk3NS45ODJDOTQ1LjQ4NyA1MzguMTQ4IDc4MC40OTIgMjIwLjc3MSA0OTQuMjc' +
              '0IDYuNjQ4QTEwNzUgMTA3NSAwIDAgMCA0ODUuMjk3IDBIMHoiIG1hc2s9InVyb' +
              'CgjeSkiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDUzLjk2NykiPjxtYXN' +
              'rIGlkPSJCIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiN6Ii8+PC9tY' +
              'XNrPjxwYXRoIGZpbGw9InVybCgjQSkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0' +
              'iTTM4OS4yMTUgMTc1LjMxNUMyNzIuMDYgODcuNjcgMTM4Ljc5NSAyOC45NjggM' +
              'CAwdjgxNC43NzZoNzczLjkwMUM3MzUuMjQgNTY4LjQ0MiA2MDQuMTg1IDMzNi4' +
              'xNDEgMzg5LjIxNSAxNzUuMzE1IiBtYXNrPSJ1cmwoI0IpIi8+PC9nPjxwYXRoI' +
              'GZpbGw9InVybCgjQykiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTU1MC44OTQ' +
              'gMzQ2LjczNEM0MDkuNzY2IDE2OS41NTcgMjEzLjczNCA0OS43MSAwIDB2NDEyL' +
              'jE5OGg1OTguODI2YTk5OSA5OTkgMCAwIDAtNDcuOTMyLTY1LjQ2eiIgdHJhbnN' +
              'mb3JtPSJ0cmFuc2xhdGUoMCA0NTYuNTQ4KSIvPjwvZz48L3N2Zz4=")'
          )
        }}
      />
    </>
  )
}
