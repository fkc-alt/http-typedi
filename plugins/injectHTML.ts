import { HtmlTagDescriptor } from 'vite'

type Props = {
  icon: string
  title: string
}

export const GenerateTags = ({ icon, title }: Props): HtmlTagDescriptor[] => [
  {
    tag: 'html',
    attrs: { lang: 'en' },
    children: [
      {
        tag: 'head',
        children: [
          {
            tag: 'meta',
            attrs: { charset: 'UTF-8' }
          },
          {
            tag: 'link',
            attrs: {
              rel: 'icon',
              type: 'image/svg+xml',
              href: icon
            }
          },
          {
            tag: 'meta',
            attrs: {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1.0'
            }
          },
          {
            tag: 'title',
            children: title
          }
        ]
      },
      {
        tag: 'body',
        children: [
          {
            tag: 'div',
            attrs: { id: 'app' }
          },
          {
            tag: 'script',
            attrs: { type: 'module', src: '/examples/main.ts' }
          }
        ]
      }
    ]
  }
]
