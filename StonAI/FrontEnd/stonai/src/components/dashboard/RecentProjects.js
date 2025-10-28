import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const projects = [
  {
    id: uuid(),
    projectName: 'Shell',
    description:'The resposibility is to design a new building for shell',
    referenceDoc: 'Contract_1.pdf',
    createdAt: 1555016400000,
    status: 'Delayed'
  },
  {
    id: uuid(),
    projectName: 'Amarco',
    description:'The resposibility is to design a new building for Amarco',
    referenceDoc: 'Contract_1.pdf',
    createdAt: 1555016400000,
    status: 'In Progress'
  },

];



const RecentProjects = (props) => (
  <Card {...props}>
    <CardHeader title="Recent Projects" />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Project Name
              </TableCell>
              <TableCell>
                Description
              </TableCell>
              <TableCell>
                Reference Doc
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip
                  enterDelay={300}
                  title="Sort"
                >
                  <TableSortLabel
                    active
                    direction="desc"
                  >
                    End Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                hover
                key={project.id}
              >

                <TableCell>
                  {project.projectName}
                </TableCell>
                <TableCell>
                  {project.description}
                </TableCell>
                <TableCell>
                  {project.referenceDoc}
                </TableCell>
                <TableCell>
                  {moment(project.createdAt).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                    <Chip    
                    color="primary"
                    label={project.status}
                    size="small"
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default RecentProjects;
