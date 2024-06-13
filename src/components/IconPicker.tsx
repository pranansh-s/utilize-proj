import { useState, useMemo, useCallback } from "react";
import * as FeatherIcons from "feather-icons-react";

//Props for IconPicker Component as mentioned in docs
interface IIconPickerProps {
  rowsInOnePage: number;
  columnsInOnePage: number;
  iconHeight: number;
  iconWidth: number;
  pickerHeight?: number;
  pickerWidth?: number;
}

const PrevArrow = FeatherIcons["ChevronLeft"];
const NextArrow = FeatherIcons["ChevronRight"];

const IconPicker: React.FC<IIconPickerProps> = ({
  rowsInOnePage,
  columnsInOnePage,
  iconHeight,
  iconWidth,
  pickerHeight = 500,
  pickerWidth = 500,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);

  // Use of useMemo hook to cache calculated hard numbers across renders

  // Set of feather icon names
  const iconNames = useMemo(
    () => Object.keys(FeatherIcons).filter((name) => name != "default"),
    [],
  );

  // Number of icons in a page
  const totalPageIcons = useMemo(
    () => rowsInOnePage * columnsInOnePage,
    [rowsInOnePage, columnsInOnePage],
  );

  // Total number of pages
  const totalPages = useMemo(
    () => Math.ceil(iconNames.length / totalPageIcons),
    [iconNames, totalPageIcons],
  );

  const handleIconChange = useCallback((icon: string) => {
    setSelectedIcon(icon);
    setIsOpen(false);
  }, []);

  const handleTogglePicker = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePagePrev = () => {
    setPage((prev) => prev - 1);
  };

  const handlePageNext = () => {
    setPage((prev) => prev + 1);
  };

  const renderIcons = useMemo(() => {
    // Extracting current page icons from whole list
    const pageIcons = iconNames.slice(
      page * totalPageIcons,
      Math.min((page + 1) * totalPageIcons, iconNames.length),
    );

    // Mapping and returning all page icons into their own components
    return pageIcons.map((iconName: string, idx: number) => {
      const Icon = FeatherIcons[iconName as keyof typeof FeatherIcons];
      return (
        <div
          key={idx}
          className="select-icon cursor-pointer hover:hue-rotate-30 hover:opacity-80 bg-blue-500 rounded-md transition-all duration-200 p-2"
          style={{ height: iconHeight, width: iconWidth }}
          //keyboard-accessibility
          aria-label={iconName}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleIconChange(iconName);
            }
          }}
          onClick={() => handleIconChange(iconName)}
        >
          <Icon className="w-full h-full" />
        </div>
      );
    });
  }, [
    iconNames,
    page,
    handleIconChange,
    iconHeight,
    iconWidth,
    totalPageIcons,
  ]);

  const SelectedIcon = selectedIcon
    ? FeatherIcons[selectedIcon as keyof typeof FeatherIcons]
    : null;

  return (
    <div className="relative">
      {/* IconPicker Component button */}
      <div
        onClick={handleTogglePicker}
        className="bg-white w-[100px] h-[100px] rounded-md cursor-pointer"
        //keyboard-accessibility
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTogglePicker();
          }
        }}
      >
        {/* Displaying Selected Icon */}
        {selectedIcon && <SelectedIcon className="w-full h-full p-5" />}
      </div>
      {/* Toggleable Popup of the IconPicker */}
      {isOpen && (
        <div
          style={{ height: pickerHeight, width: pickerWidth }}
          className="absolute flex flex-col bg-white space-y-5 p-8 min-h-[300px] min-w-[300px] rounded-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex justify-between border-b-2 pb-2">
            <p className="text-2xl font-bold">Select an Icon</p>
            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <button
                disabled={page == 0}
                className="disabled:opacity-20"
                onClick={handlePagePrev}
              >
                <PrevArrow />
              </button>
              <span>{page + 1}</span>
              <button
                disabled={page == totalPages - 1}
                className="disabled:opacity-20"
                onClick={handlePageNext}
              >
                <NextArrow />
              </button>
            </div>
          </div>
          {/* Grid to display the icons */}
          <div
            className="grid overflow-y-scroll h-full p-2 gap-2"
            style={{
              gridTemplateColumns: `repeat(${columnsInOnePage}, minmax(0, 1fr))`,
            }}
          >
            {renderIcons}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
