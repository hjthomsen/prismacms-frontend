import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  "&.active": {
    "& .MuiButton-root": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const Navbar = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PrismaCMS
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <StyledNavLink to="/">
              <Button color="inherit" variant="text">
                Dashboard
              </Button>
            </StyledNavLink>
            <StyledNavLink to="/customers">
              <Button color="inherit" variant="text">
                Customers
              </Button>
            </StyledNavLink>
            <StyledNavLink to="/financial-statements">
              <Button color="inherit" variant="text">
                Financial Statements
              </Button>
            </StyledNavLink>
            <StyledNavLink to="/timesheet">
              <Button color="inherit" variant="text">
                Timesheet
              </Button>
            </StyledNavLink>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
