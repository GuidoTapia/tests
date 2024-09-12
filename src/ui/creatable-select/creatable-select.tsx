import {
  Combobox,
  ComboboxItem,
  Divider,
  InputBase,
  useCombobox,
} from "@mantine/core"
import { ChangeEvent, useState } from "react"

interface CreatableSelectProps {
  data: Array<string | ComboboxItem>
  onChange: (value: string) => void
  onCreate?: (value?: string) => void
  createLabel?: string | ((createValue: string) => string)
  label?: string
  value?: string
  placeholder?: string
}

export const CreatableSelect = (props: CreatableSelectProps) => {
  const { data, onCreate, createLabel, label, value, onChange, placeholder } =
    props
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const [search, setSearch] = useState<string>("")

  const selectedItem = data.find((item) =>
    typeof item === "string" ? item === value : item.value === value
  )

  const selectedLabel =
    typeof selectedItem === "string" ? selectedItem : selectedItem?.label

  const filteredOptions = data.filter((item) => {
    if (!search) return true
    return typeof item === "string"
      ? item.toLowerCase().trim().includes(search.toLowerCase().trim())
      : item.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  })

  const onOptionSubmit = (optionValue: string) => {
    if (optionValue === "$create") {
      onCreate && onCreate(search)
      onChange(search ?? "")
    } else {
      onChange(optionValue)
      const valItem = data.find((item) =>
        typeof item === "string"
          ? item === optionValue
          : item.value === optionValue
      )
      const valLabel = typeof valItem === "string" ? valItem : valItem?.label
      setSearch(valLabel ?? "")
    }

    combobox.closeDropdown()
  }

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    combobox.openDropdown()
    combobox.updateSelectedOptionIndex()
    setSearch(event.currentTarget.value)
  }

  const onBlur = () => {
    combobox.closeDropdown()
    setSearch(selectedLabel || "")
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={onOptionSubmit}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          rightSection={<Combobox.Chevron />}
          value={search ?? selectedLabel}
          onChange={onSearchChange}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={onBlur}
          placeholder={placeholder}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown mah={200} style={{ overflowY: "scroll" }}>
        <Combobox.Options>
          {filteredOptions.map((item) => (
            <Combobox.Option
              value={typeof item === "string" ? item : item.value}
              key={typeof item === "string" ? item : item.value}
            >
              {typeof item === "string" ? item : item.label}
            </Combobox.Option>
          ))}
          {filteredOptions.length > 0 ? <Divider /> : null}
          <Combobox.Option value="$create">
            {createLabel && typeof createLabel === "string"
              ? createLabel
              : null}
            {createLabel && typeof createLabel === "function"
              ? createLabel(search ?? "")
              : null}
            {createLabel ? null : `+ Add: ${search}`}
          </Combobox.Option>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
