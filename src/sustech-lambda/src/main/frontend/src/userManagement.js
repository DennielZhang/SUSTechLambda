import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";
import ErrorIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

let counter = 0;
const isDebug = true;

const apiHost = isDebug ? "http://localhost:8080" : "";

function createData(name, calories, fat, carbs, protein) {
    counter += 1;
    return {id: counter, name, calories, fat, carbs, protein};
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows =  [
    {id: 'id', numeric: false, disablePadding: false, label: 'id'},
    {id: 'userName', numeric: false, disablePadding: true, label: 'userName'},
    {id: 'displayName', numeric: false, disablePadding: false, label: 'displayName'},
    {id: 'roles', numeric: false, disablePadding: false, label: 'roles'},
]

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                            checkedIcon={<RefreshIcon/>}
                        />
                    </TableCell>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const {numSelected, classes} = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected to be reset password
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        All users
                    </Typography>
                )}
            </div>
            <div className={classes.spacer}/>
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Reset">
                        <IconButton arial-label='reset' onClick={() => props.handleResetPassword()}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '95%',
        marginLeft: 'auto',
        marginRight:'auto',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class EnhancedTable extends React.Component {
    constructor(props) {
        let data = []
        data = [
            {id: 1, userName: 'bbbb', displayName: 'cccc', roles: ['USER']},
            {id: 2, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 3, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 4, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 5, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 6, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 7, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 8, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 9, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 10, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 11, userName: 'babb', displayName: 'cccc', roles: ['USER']},
            {id: 12, userName: 'babb', displayName: 'cccc', roles: ['USER']},
        ]
        super(props)
        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: data,
            page: 0,
            rowsPerPage: 5,
            snakebarContent: '',
            alertAllFieled: false,
        };
    }


    componentDidMount() {
        let url = ''
        url = `${apiHost}/api/users/?page_idx=0&page_size=100`

        let myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${this.props.token}`)
        let myinit = {
            method: 'GET', headers: myHeaders, mode: 'cors', cache: 'default'
        }
        fetch(url, {method: 'GET', headers: myHeaders})
            .then(response => response.json().then(data => {
                this.setState({data: data.content})
            }))
    }

    handleResetPassword = () => {
        let selected = this.state.selected
        let result = true

        selected.map(
            pr => {
                console.log(pr)
                let url = `${apiHost}/api/users/${pr}/reset-password`
                const myRequest = new Request(url, {
                    method: 'POST', headers: {
                        'Authorization': `Bearer ${this.props.token}`
                    }
                });
                fetch(myRequest)
                    .then(
                        response => response.json().then(prs=>{

                            if (response.status == 200) {
                                this.setState(
                                    {
                                        snakebarContent: `Reset Successfully, new password is ${prs['newPassword']}`,
                                        alertAllFieled: true,
                                        selected: []
                                    }
                                )
                            }
                        })
                    )
            }
        )
        // if (result) {
        //     this.setState(
        //         {
        //             snakebarContent: 'Reset Successfully',
        //             alertAllFieled: true,
        //             selected: []
        //         }
        //     )
        // }


    }
    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {classes} = this.props;
        const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <div>
                <Paper className={classes.root}>
                    <EnhancedTableToolbar numSelected={selected.length} handleResetPassword={this.handleResetPassword}/>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        const isSelected = this.isSelected(n.id);
                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => this.handleClick(event, n.id)}
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.id}
                                                selected={isSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isSelected} checkedIcon={<RefreshIcon/>}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.id}
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.userName}
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.displayName}
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.roles}
                                                </TableCell>

                                            </TableRow>
                                        );

                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{height: 49 * emptyRows}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={this.state.alertAllFieled}
                    onClose={() => {
                        this.setState({alertAllFieled: false})
                    }}
                    autoHideDuration={3000}
                >
                    <SnackbarContent
                        style={{backgroundColor: "#ff1a24"}}
                        message={<span style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>  <ErrorIcon/>{this.state.snakebarContent}</span>}
                    >
                    </SnackbarContent>
                </Snackbar>
            </div>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);