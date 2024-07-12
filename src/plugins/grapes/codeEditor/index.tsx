import { Editor, PluginOptions } from 'grapesjs'
import { Commands } from '../editor/Commands'

export default (editor: Editor, opts = {}) => {
  const options: PluginOptions = {
    ...{
      //Panel to append the code editor
      panelId: 'views-container',
      //Append to element instead of views-container
      appendTo: '',
      //State when open
      openState: {
        cv: '65%',
        pn: '35%',
      },
      //State when closed
      closedState: {
        cv: '85%',
        pn: '15%',
      },
      //Code viewer options
      codeViewOptions: {
        theme: 'hopscotch',
        readOnly: 0,
        autoBeautify: 1,
        autoCloseTags: 1,
        autoCloseBrackets: 1,
        styleActiveLine: 1,
        smartIndent: 1,
      },
      //Stop resizing openState and closedState
      preserveWidth: false,
      //Allow editing of javascript, set allowScripts to true for this to work
      editJs: true,
      //Remove component data eg data-gjs-type="..."
      clearData: false,
      //Used to remove css from the Selector Manager
      cleanCssBtn: true,
      //Save HTML button text
      htmlBtnText: 'Apply',
      //Save CSS button text
      cssBtnText: 'Apply',
      //Clean CSS button text
      cleanCssBtnText: 'Delete',
    },
    ...opts,
  }

  Commands(editor, options)
}
