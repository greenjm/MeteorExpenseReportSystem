import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

// Security
Projects.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// Helpers
function isAdmin() {
  const currentUser = Meteor.user();

  if (currentUser == null || currentUser.profile == null) {
    return false;
  }

  return currentUser.profile.isAdmin;
}

function isManager(projectId) {
  const currentUser = Meteor.user();

  if (currentUser == null || currentUser.profile == null) {
    return false;
  }

  const project = Projects.findOne({ managers: { $in: [currentUser._id] }, _id: projectId });
  return project != null || currentUser.profile.isAdmin;
}

/**
The commented out methods using ValidatedMethod are designed to be used
for testing purposes. Should they succeed, they and others will be created
to replace the current methods.
*/

// export const createProject = new ValidatedMethod({
//   name: 'projects.create',
//   validate: new SimpleSchema({
//     name: { type: String },
//     mgr: { type: String },
//   }).validator(),
//   run({ name, mgr }) {
//     if (isAdmin()) {
//       return Projects.insert({
//         name,
//         managers: [mgr],
//         employees: [],
//         bornOn: new Date(),
//         isActive: true,
//         inactiveDate: null,
//       });
//     }
//     throw new Meteor.Error('projects.create.unauthorized',
//       'You do not have permission to create projects.');
//   },
// });

// export const addManager = new ValidatedMethod({
//   name: 'projects.addManager',
//   validate: new SimpleSchema({
//     proj: { type: String },
//     user: { type: String },
//   }).validator(),
//   run({ proj, user }) {
//     if (isAdmin()) {
//       const result = Projects.update({ _id: proj },
//                       { $addToSet: { managers: user } });

//       return result.nModified === 1;
//     }
//     throw new Meteor.Error('projects.addManager.unauthorized',
//       'You do not have permission to add managers.');
//   },
// });

Meteor.methods({
  /**
  Creates new project using the name of the project and one manager provided
  @param name, String; name of project
  @param mgr, String; UserId of manager
  @return boolean; returns true if project was successfully created and added to collection
  **/
  'projects.create': function createProject(name, employees, managers) {
    check(name, String);
    check(employees, Array);
    check(managers, Array);

    if (isAdmin()) {
      const empIds = [];
      const manIds = [];
      for (let i = 0; i < employees.length; i += 1) {
        empIds.push(employees[i]._id);
      }
      for (let i = 0; i < managers.length; i += 1) {
        manIds.push(managers[i]._id);
      }
      return Projects.insert({ name,
        managers: manIds,
        employees: empIds,
        bornOn: new Date(),
        isActive: true,
        inactiveDate: null });
    }
    throw new Meteor.Error('projects.create.unauthorized', 'You do not have permission to create projects.');
  },

  'projects.addManager': function addManager(proj, user) {
    // set manager(s) to the project
    check(proj, String);
    check(user, String);

    if (isAdmin()) {
      const result = Projects.update({ _id: proj },
                      { $addToSet: { managers: user } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.addManager.unauthorized', 'You do not have permission to add managers.');
  },

  'projects.removeManager': function removeManager(proj, user) {
    // remove manager from project
    check(proj, String);
    check(user, String);

    if (isAdmin()) {
      const result = Projects.update({ _id: proj },
                    { $pull: { managers: user } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.removeManager.unauthorized', 'You do not have permission to remove managers.');
  },

  'projects.addEmployee': function addEmployee(proj, user) {
    // add employees to project
    check(proj, String);
    check(user, String);

    if (isManager(proj)) {
      const result = Projects.update({ _id: proj },
                    { $addToSet: { employees: user } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.addEmployee.unauthorized', 'You do not have permission to add employees.');
  },

  'projects.removeEmployee': function removeEmployee(proj, user) {
    // remove employees from project
    check(proj, String);
    check(user, String);

    if (isManager(proj)) {
      const result = Projects.update({ _id: proj },
                    { $pull: { employees: user } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.removeEmployee.unauthorized', 'You do not have permission to remove employees.');
  },

  'projects.activate': function activate(proj) {
    // activate project
    check(proj, String);

    if (isAdmin()) {
      const result = Projects.update({ _id: proj },
                    { $set: { isActive: true, inactiveDate: null } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.activate.unauthorized', 'You do not have permission to activate projects.');
  },

  'projects.deactivate': function deactivate(proj) {
    // deactivate project
    check(proj, String);

    if (isAdmin()) {
      const result = Projects.update({ _id: proj },
                    { $set: { isActive: false, inactiveDate: new Date() } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.deactivate.unauthorized', 'You do not have permission to deactivate projects.');
  },

  'projects.editName': function editName(proj, newname) {
    check(proj, String);
    check(newname, String);

    if (newname === '') {
      throw new Meteor.Error('projects.editName.emptyName', 'You did not provide a new name for the project.');
    }

    if (isAdmin()) {
      const result = Projects.update({ _id: proj },
                    { $set: { name: newname } });

      return result.nModified === 1;
    }
    throw new Meteor.Error('projects.editName.unauthorized', 'You do not have permission to change name of projects.');
  },

  // signIn: function signIn(givenId) {
  //   check(givenId, String);
  //   this.setUserId(givenId);
  // },
});
