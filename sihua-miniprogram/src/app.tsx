import { Component, ReactNode } from 'react';
import './app.scss';

interface AppProps {
  children?: ReactNode;
}

class App extends Component<AppProps> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;
