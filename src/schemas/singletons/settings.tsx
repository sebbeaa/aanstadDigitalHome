import { CogIcon } from '@sanity/icons'
import { Button, Text, TextInput } from '@sanity/ui'
import React from 'react'
import { defineField, defineType, set } from 'sanity'

import Grapes from '../../plugins/grapes'

interface PasswordGeneratorProps {
  length: number
}

export default defineType({
  name: 'settings',
  title: 'Settings | Body',
  type: 'document',
  icon: CogIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'hidePage',
      type: 'object',
      initialValue: {
        private: false,
        password: '',
      },
      fields: [
        defineField({
          type: 'boolean',
          name: 'private',
          title: 'Password protect entire site?',
          initialValue: false,
        }),
        defineField({
          type: 'array',
          name: 'users',
          title: 'Users',
          hidden: ({ parent }) => !parent?.private,
          of: [
            {
              type: 'object',
              name: 'userName',
              fields: [
                { type: 'string', name: 'username', title: 'Username' },
                {
                  type: 'string',
                  name: 'password',
                  title: 'Password',
                  components: {
                    input: ({ value, onChange }: any) => {
                      const generatePassword = () => {
                        const characters =
                          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                        let password = ''
                        for (let i = 0; i < 16; i++) {
                          const randomIndex = Math.floor(
                            Math.random() * characters.length,
                          )
                          password += characters.charAt(randomIndex)
                        }
                        return onChange(set(password))
                      }

                      return (
                        <div>
                          <Text>
                            <strong>Value:</strong> {value && value}
                          </Text>
                          <br />
                          <Button onClick={() => generatePassword()}>
                            Generate Password
                          </Button>
                          <Button onClick={() => onChange(set(''))}>
                            Clear Password
                          </Button>
                        </div>
                      )
                    },
                  },
                },
                {
                  type: 'boolean',
                  name: 'signedIn',
                  title: 'Signed In',
                  initialValue: false,
                },

                {
                  type: 'number',
                  name: 'index',
                  title: 'Index',
                  initialValue: 0,
                },
              ],
            },
          ],
        }),
        defineField({
          name: 'content',
          title: 'Sign In Page',
          type: 'grapesEditor',
          initialValue: {
            html: '',
            css: '',
          },
          hidden: ({ parent }) => !parent?.private,
          options: {
            collapsible: true,
            collapsed: true,
          },
        }),
      ],
    }),

    defineField({
      name: 'content',
      title: 'Header and Footer',
      type: 'grapesEditor',
      initialValue: {
        html: '',
        css: '',
      },
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Items',
      }
    },
  },
})
