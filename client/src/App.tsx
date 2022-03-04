import './App.scss';
import { Header } from './layouts/Header';
import { Menu } from './layouts/Menu';
import { Page } from './layouts/Page';
import 'bulma/css/bulma.min.css';

function App() {
  return (
    <div className='body'>
      <Header>
      </Header>
      <div className="columns">
        <div className="column is-one-quarter">
          <Menu>
          </Menu>
        </div>
        <div className="column">
          <Page>
          </Page>
        </div>
      </div>
    </div>
  );
}

export default App;
