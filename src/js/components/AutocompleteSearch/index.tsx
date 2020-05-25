import React, { useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { TextField, Paper } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ViewOnlyTab from 'components/Tab/ViewOnlyTab'
import { useStore } from 'components/StoreContext'
import ListboxComponent from './ListboxComponent'
import matchSorter from 'match-sorter'
import Tab from 'stores/Tab'

const ARIA_LABLE = 'Search your tab title or URL ... (Press "/" to focus)'

const getOptionLabel = (option: Tab) => option.title + option.url

const getFilterOptions = (showUrl) => {
  return (options, { inputValue }) => {
    const keys = ['title']
    if (showUrl) {
      keys.push('url')
    }
    return matchSorter(options, inputValue, { keys })
  }
}

const renderTabOption = (tab) => {
  return <ViewOnlyTab tab={tab} />
}

const Input = (props) => (
  <TextField fullWidth placeholder={ARIA_LABLE} variant='standard' {...props} />
)

const useSearchInputRef = () => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { searchStore } = useStore()
  const { setSearchEl } = searchStore

  useEffect(() => setSearchEl(searchInputRef))
  return searchInputRef
}

const AutocompleteSearch = observer(() => {
  const searchInputRef = useSearchInputRef()
  const { userStore, searchStore, windowStore } = useStore()
  const { search, query, startType, stopType } = searchStore

  const filterOptions = getFilterOptions(userStore.showUrl)

  return (
    <Autocomplete
      fullWidth
      blurOnSelect
      freeSolo
      selectOnFocus
      openOnFocus
      autoHighlight
      ref={searchInputRef}
      inputValue={query}
      disableListWrap
      PaperComponent={(props) => <Paper elevation={24}>{props.children}</Paper>}
      onFocus={() => {
        startType()
        search(query)
      }}
      onBlur={() => stopType()}
      onInputChange={(_, value, reason) => {
        if (reason !== 'reset') {
          search(value)
        }
      }}
      onChange={(_, tab) => {
        tab.activate()
        search('')
      }}
      renderInput={(props) => (
        <Input {...props} autoFocus={userStore.autoFocusSearch} />
      )}
      getOptionLabel={getOptionLabel}
      options={windowStore.tabs}
      renderOption={renderTabOption}
      filterOptions={filterOptions}
      ListboxComponent={ListboxComponent}
    />
  )
})

export default AutocompleteSearch
