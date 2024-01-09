// All the API urls
//todo: Express Router => Define the endpoint of each HTTP method and the controller to handle the request-response
const router = require('express').Router();
const upload = require('../utils/multer');
const projectController = require('../controllers/project.controller');
const middleware = require('../utils/middleware');

router.post('/createProject', upload.array("files"), projectController.createProject);

router.put('/updateStatus/:id', projectController.updateProjectStatus);

router.put('/updateProject/:id', upload.array("files"), projectController.updateProject);

//* To delete the "UPLOADED" files of a project
router.put('/deleteProjectAttachment/:id', projectController.deleteProjectAttachment);

router.delete('/delete/:projectId', projectController.deleteProject);

router.get('/getProjectsByWeek', projectController.getProjectsByWeek);

// Specifically get the necessary details of a project for a task
router.get('/getProjectOfTask/:projectId', projectController.getProjectOfTask);

// Specifically get the necessary details of "ALL" project of aa "CLIENT"
router.get('/getProjectsOfClient/:client_id', projectController.getProjectsOfClient);

// Get all the details of a project
router.get('/getProject/:projectId', [ projectController.getProjectById, middleware.getProjectEngineer ]);

router.get('/allProjects', projectController.getAllProject);

//* Get projects when user.role == "MANAGER"
router.get('/paginate', projectController.paginateProject);
//* Get projects of a specific "CLIENT || ENGINEER"
router.get('/paginate/:user_id', projectController.paginateProject);
//* "MANAGER" view the list of projects of a "CLIENT"
router.get('/viewClientProject/:user_id', [ projectController.paginateProject ]);

router.get('/projectsForTask', projectController.getProjectsForTaskSelection);

// Needed by Ticket Module
router.get('/getNameAndLeader/:project_id', projectController.getProjectNameAndLeader);
router.get('/getEngineers/:project_id', projectController.getProjectEngineers);

//! Required by "Dashboard" analysis at the frontend
router.get('/projectAnalysis', projectController.getProjectDash);

module.exports = router;
