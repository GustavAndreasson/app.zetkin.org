import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.projects', {
  activityList: {
    linkToSummary: m('Go to my active projects.'),
    noActivities: m(
      'If your organization has activities that do not belong to a project they will show up here.'
    ),
  },
  all: {
    cardCTP: m('Go to project'),
    create: m('Create new project'),
    filter: {
      calls: m('Call assignments'),
      canvasses: m('Canvass assignments'),
      filter: m('Filter results'),
      standalones: m('Standalone events'),
      surveys: m('Surveys'),
    },
    heading: m('Current projects'),
    indefinite: m('Indefinite'),
    unsorted: m('Unsorted projects'),
    upcoming: m<{ numEvents: number }>('{numEvents, number} upcoming events.'),
  },
  assigneeActions: m('Assignee actions'),
  calendarView: m('See all in calendar'),
  events: m('Events'),
  feedback: {
    copy: m(
      'Collecting feedback (during phonebanks or standalone) can help you work more efficiently'
    ),
    create: m('Create survey'),
    heading: m('Feedback and Surveys (none configured)'),
  },
  form: {
    createProject: {
      create: m('Create project'),
      error: m('There was an error creating the project'),
      newProject: m('My project'),
    },
    deleteProject: {
      cancel: m('Cancel'),
      error: m('There was an error deleting the project'),
      submitButton: m('Confirm deletion'),
      title: m('Delete project'),
      warning: m(
        'Are you sure you want to delete this project? This action is permanent.'
      ),
    },
    description: m('Description'),
    edit: m('Edit project'),
    editProjectTitle: {
      error: m('Error updating project title'),
      success: m('Project title updated'),
    },
    manager: {
      label: m('Project manager'),
      selectSelf: m('Set yourself as manager'),
    },
    name: m('Name'),
    requestError: m('There was an error. Please try again.'),
    required: m('Required'),
    status: {
      draft: m('Draft'),
      heading: m('Status'),
      published: m('Published'),
    },
    visibility: {
      heading: m('Visibility'),
      private: m('Private'),
      public: m('Public'),
    },
  },
  indefinite: m('Indefinite timeline'),
  layout: {
    activities: m('Activities'),
    allProjects: m('All Projects'),
    archive: m('Archive'),
    calendar: m('Calendar'),
    insights: m('Insights'),
    summary: m('Summary'),
  },
  linkGroup: {
    public: m('Public Page'),
    settings: m('Edit Settings'),
  },
  mobilization: {
    copy: m(
      'Organizing a phone bank to mobilize your organization will increase participation manifold'
    ),
    create: m('Create call assignment'),
    heading: m('Mobilization and outreach (none configured)'),
  },
  noManager: m('No Project Manager'),
  projectManager: m('Project Manager'),
  taskLayout: {
    tabs: {
      assignees: m('Assignees'),
      insights: m('Insights'),
      summary: m('Summary'),
    },
  },
  tasks: m('Tasks'),
});
