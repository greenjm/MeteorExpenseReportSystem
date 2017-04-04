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

Meteor.methods({
  /**
  Creates new project using the name of the project and one manager provided
  @param name {String} name of project
  @param mgr {String} UserId of manager
  @return {Boolean} true if project was successfully created and added to collection
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

  /**
  Edits the details of a specific project.
  @param id {String} the project's ID
  @param name {String} new project name
  @param active {Boolean} project's active status
  @param employees {Array} list of employee IDs
  @param managers {Array} list of manager IDs
  @return {Boolean} true if the update succeeded
  */
  'projects.edit': function editProject(id, name, active, employees, managers) {
    check(id, String);
    check(name, String);
    check(active, Boolean);
    check(employees, Array);
    check(managers, Array);

    if (isAdmin()) {
      const project = Projects.findOne(id);
      if (project === null || project === undefined) {
        throw new Meteor.Error('projects.edit.badId', 'The ID does not match a project in the database.');
      }
      let inactiveDate = null;
      if (!active) {
        inactiveDate = new Date();
      }
      const empIds = [];
      const manIds = [];
      for (let i = 0; i < employees.length; i += 1) {
        empIds.push(employees[i]._id);
      }
      for (let i = 0; i < managers.length; i += 1) {
        manIds.push(managers[i]._id);
      }
      return Projects.update({ _id: id },
        {
          $set: {
            name,
            isActive: active,
            inactiveDate,
            employees: empIds,
            managers: manIds,
          },
        }
      );
    }
    throw new Meteor.Error('projects.edit.unauthorized', 'You do not have permission to edit projects.');
  },

  /**
  Returns the name of the project with the specified id.
  @param id {String} the project's ID
  */
  'projects.name': function viewName(id) {
    check(id, String);
    var project = Projects.find({ _id: id }).fetch();

    return project[0].name;
  },
});
