import IconPicker from "./components/IconPicker";

function App() {
  return (
    <div className="flex items-center min-h-screen justify-center bg-orange-200">
      <IconPicker
        rowsInOnePage={6}
        columnsInOnePage={6}
        iconHeight={48}
        iconWidth={48}
      />
    </div>
  );
}

export default App;
