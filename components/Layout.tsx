import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: 'white',
    color: 'black',
    borderBottom: '1px solid #ccc',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    // backgroundColor: '#dfdac6',
    width: drawerWidth,
    backdropFilter: 'blur(15px)', // Apply backdrop-filter
    background: '#ffffffd6', // Apply background color
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  activeLink: {
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007bff',
  },
}));
type Props = {
  children?: ReactNode;
};
const Layout = ({ children }: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = React.useState(false)
  const [userRole, setUserRole] = React.useState(null)
  React.useEffect(() => {
    const userData = JSON?.parse?.(localStorage?.getItem?.('userData'));
    if (!userData) {
      if (window.location.pathname === '/airport')
        router.push('/airport');
      else
        router.push('/login');
      setShowDrawer(false);
    } else {
      setUserRole(userData.user.role);
      if (window.location.pathname === '/airport') {
        router.push('/airport');
        setShowDrawer(false);
      } else {
        if (userData.user.role == 'admin')
          router.push('/Home');
        else if (userData.user.role == 'lmh')
          router.push('/doctor');
        else if (userData.user.role == 'doctor')
          router.push('/prescription');
        setShowDrawer(true);
      }
    }
  }, []);
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userData");
    setShowDrawer(false);
    router.push('/login');
  };
  return (
    <>
      <Head>
        <title>HealthApp</title>
        <meta name="description" content="cuteastros is a unique collection of cute astronauts" />
      </Head>
      <div className={classes.root}>
        {showDrawer && (<Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List>
            {userRole == 'admin' && <Link href="/Home">
              <ListItem
                button
                selected={router.asPath === '/Home'}
                className={router.asPath === '/Home' ? classes.activeLink : ''}
              >
                <ListItemText primary="LMH" />
              </ListItem>
            </Link>}

            {userRole == 'lmh' &&
              <Link href="/doctor">
                <ListItem
                  button
                  selected={router.asPath === '/doctor'}
                  className={router.asPath === '/doctor' ? classes.activeLink : ''}
                >
                  <ListItemText primary="Doctor" />
                </ListItem>
              </Link>}

            {userRole == 'lmh' &&
              <Link href="/prohibited_drugs">
                <ListItem
                  button
                  selected={router.asPath === '/prohibited_drugs'}
                  className={router.asPath === '/prohibited_drugs' ? classes.activeLink : ''}
                >
                  <ListItemText primary="Prohibited Drug" />
                </ListItem>
              </Link>}

            {userRole == 'doctor' &&
              <Link href="/prescription">
                <ListItem
                  button
                  selected={router.asPath === '/prescription'}
                  className={router.asPath === '/prescription' ? classes.activeLink : ''}
                >
                  <ListItemText primary="Prescription" />
                </ListItem>
              </Link>}
            <Link href="/">
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </Link>
          </List>
        </Drawer>)}

        <main className={classes.content}>
          {children}
        </main>
      </div>


    </>
  );
};

export default Layout;
