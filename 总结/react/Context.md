## Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level

在 React 项目中，一般情况下数据是通过属性一层层从上级传递到下级的，但是在有很多组件都依赖某些数据的时候，这样从上到下层层会很冗余

`Context` 为组件间共享数据提供了一种新方式，可以避免层层传递数据。

```react
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
    render() {
        // Use a Provider to pass the current theme to the tree below.
        // Any component can read it, no matter how deep it is.
        // In this example, we're passing "dark" as the current value.
        return (
            <ThemeContext.Provider value="dark">
                <Toolbar />
            </ThemeContext.Provider>
        );
    }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

class ThemedButton extends React.Component {
      // Assign a contextType to read the current theme context.
      // React will find the closest theme Provider above and use its value.
      // In this example, the current theme is "dark".
      static contextType = ThemeContext;
      render() {
            return <Button theme={this.context} />;
      }
}
```

如果是函数式组件，无法使用 `contextType` ，这时候可以用 `useContext` 来代替，两者功能是一样的。

```react
function ThemedButton() {
    const theme = useContext(ThemeContext);

    return (
        <button style={{ background: theme.background, color: theme.foreground }}>
            I am styled by theme context!
        </button>
    );
}
```

