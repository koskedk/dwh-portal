import { AppFooter, AppHeader, AppBreadcrumb2 as AppBreadcrumb } from '@coreui/react';
import { Container } from 'reactstrap';
import { Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import React, { Suspense } from "react";
import routes from '../../routes';
import UniversalFilter from '../../views/Shared/UniversalFilter';
import Loading from '../../views/Shared/Loading';
import { useSelector } from 'react-redux';
import PrivateRoute from '../../utils/protectedRoute';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const DefaultLayout = () => {
    const ui = useSelector(state => state.ui);

    return (
        <div className="app">
            <AppHeader fixed>
                <Suspense fallback={<Loading/>}>
                    <DefaultHeader />
                </Suspense>
            </AppHeader>
            <Container fluid className={ui.stickyFilter === true ? 'stickyUniversalFilter':'hiddenUniversalFilter'}>
                <UniversalFilter />
            </Container>
            <div className="app-body">
                <main className={"main"}>
                    <AppBreadcrumb appRoutes={routes} router={router} />
                    <Container fluid>
                        <Suspense fallback={<Loading/>}>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        route.private ? <PrivateRoute
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                render={props => (
                                                    <route.component {...props}/>
                                                )} /> :
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props}/>
                                            )} />
                                    ) : (null);
                                })}
                            </Switch>
                        </Suspense>
                    </Container>
                </main>
            </div>
            <AppFooter>
                <Suspense fallback={<Loading/>}>
                    <DefaultFooter />
                </Suspense>
            </AppFooter>
        </div>
    );
}

export default DefaultLayout;
