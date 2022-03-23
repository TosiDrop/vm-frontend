import { Header } from './layouts/header.layout';
import { Menu } from './layouts/menu.layout';
import { Page } from './layouts/page.layout';
import './styles.scss';

function App() {
    return (
        <div className='body'>
            <Header>
            </Header>
            <div className="columns">
                <div className="column is-one-fifth">
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
