import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  Meteor.publish('projects', () => {
    const currentUser = Meteor.user();

    if (currentUser == null || currentUser.profile == null) {
      return {};
    }

    if (currentUser.profile.isAdmin) {
      const projects = Projects.find();
      return projects;
    }

    const projects = Projects.find({ $or: [{
      managers: Meteor.userId() }, { employees: Meteor.userId() }] });
    return projects;
  });
}

Meteor.methods({
  /**
  Creates new project using the name of the project and one manager provided
  @param name, String; name of project
  @param mgr, String; UserId of manager
  @return boolean; returns true if project was successfully created and added to collection
  **/
  'projects.create': function createProject(name, mgr) {
    check(name, String);
    check(mgr, String);

    return Projects.insert({ name,
      managers: [mgr],
      employees: [],
      bornOn: new Date(),
      isActive: true,
      inactiveDate: null });
  },

  'projects.addManager': function addManager(proj, user) {
    // set manager(s) to the project
    check(proj, String);
    check(user, String);

    const result = Projects.update({ _id: proj },
                    { $addToSet: { managers: user } });

    return result.nModified === 1;
  },

  'projects.removeManager': function removeManager(proj, user) {
    // remove manager from project
    check(proj, String);
    check(user, String);

    const result = Projects.update({ _id: proj },
                    { $pull: { managers: user } });

    return result.nModified === 1;
  },

  'projects.addEmployee': function addEmployee(proj, user) {
    // add employees to project
    check(proj, String);
    check(user, String);

    const result = Projects.update({ _id: proj },
                    { $addToSet: { employees: user } });

    return result.nModified === 1;
  },

  'projects.removeEmployee': function removeEmployee(proj, user) {
    // remove employees from project
    check(proj, String);
    check(user, String);

    const result = Projects.update({ _id: proj },
                    { $pull: { employees: user } });

    return result.nModified === 1;
  },

  'projects.activate': function activate(proj) {
    // activate project
    check(proj, String);

    const result = Projects.update({ _id: proj },
                    { $set: { isActive: true, inactiveDate: null } });

    return result.nModified === 1;
  },

  'projects.deactivate': function deactivate(proj) {
    // deactivate project
    check(proj, String);

    const result = Projects.update({ _id: proj },
                    { $set: { isActive: false, inactiveDate: new Date() } });

    return result.nModified === 1;
  },
});
