import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import { getNoun } from 'libs'

const Title = ({ title }) => {
  useEffect(() => {
    document.title = `Tab Manager v2: ${title}`
  }, [title])
  return title
}

const fakeButtonStyle = {
  position: 'fixed',
  top: 0,
  width: '100%',
  margin: 'auto',
  fontSize: '0.8rem',
  padding: 0,
  border: 'none'
}

@inject('searchStore')
@inject('tabStore')
@inject('windowStore')
@observer
class Summary extends React.Component {
  onFocus = e => {
    e.target.blur()
  }

  getOpacity = () => {
    const {
      searchStore: { typing, query }
    } = this.props
    if (!typing) {
      return 1
    }
    return 1 - (Math.atan(query.length + 1) / Math.PI) * 1.2
  }

  render () {
    const {
      windowStore: { tabCount, windows },
      tabStore: { selection }
    } = this.props
    const opacity = this.getOpacity()
    const style = { ...fakeButtonStyle, opacity }
    const selected = selection.size
    const title = `${windows.length} ${getNoun(
      'window',
      windows.length
    )}, ${tabCount} ${getNoun('tab', tabCount)}`
    return (
      <ButtonBase style={style} onFocus={this.onFocus}>
        <Typography>
          <Title {...{ title }} />, {selected} {getNoun('tab', selected)}{' '}
          selected
        </Typography>
      </ButtonBase>
    )
  }
}

export default Summary
