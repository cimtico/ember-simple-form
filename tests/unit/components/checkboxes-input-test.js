import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import FormBuilder from "ember-simple-form/models/form-builder";
import inputComponent from "ember-simple-form/helpers/input-component";

var attr = "category";
var formBuilder;
var model;

Ember.HTMLBars._registerHelper("input-component", inputComponent);

moduleForComponent("inputs/checkboxes-input", "Checkboxes Input component", {
  needs: ["component:inputs/checkbox-option",
          "template:components/inputs/checkboxes-input",
          "template:components/inputs/checkbox-option"]
});

test("it renders collection of strings as radio buttons or checkboxes", function(assert) {
  var component = this.subject({
    collection: Ember.A(["Cooking", "Sports", "Politics"]),
    value: "Cooking"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input[type=radio][value=Cooking]+label").text().replace(/\s/, ""), "Cooking");
  assert.equal(component.$("input[type=radio][value=Sports]+label").text().replace(/\s/, ""), "Sports");
  assert.equal(component.$("input[type=radio][value=Politics]+label").text().replace(/\s/, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=Cooking]").attr("value"), "Cooking");
  assert.equal(component.$("input[type=radio][value=Sports]").attr("value"), "Sports");
  assert.equal(component.$("input[type=radio][value=Politics]").attr("value"), "Politics");

  Ember.run(function() {
    component.set("value", Ember.A(["Cooking"]));
    component.set("isMultiple", true);
  });

  assert.equal(component.$("input[type=checkbox][value=Cooking]+label").text().replace(/\s/, ""), "Cooking");
  assert.equal(component.$("input[type=checkbox][value=Sports]+label").text().replace(/\s/, ""), "Sports");
  assert.equal(component.$("input[type=checkbox][value=Politics]+label").text().replace(/\s/, ""), "Politics");
  assert.equal(component.$("input[type=checkbox][value=Cooking]").attr("value"), "Cooking");
  assert.equal(component.$("input[type=checkbox][value=Sports]").attr("value"), "Sports");
  assert.equal(component.$("input[type=checkbox][value=Politics]").attr("value"), "Politics");

});

test("it renders collection objects as inputs", function(assert) {
  var component = this.subject({
    collection: Ember.A([{
      id: 1, name: "Cooking", slug: "cooking", headline: "For kitchen geeks!"
    }, {
      id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
    }, {
      id: 3, name: "Politics", slug: "politics", headline: "For nerds"
    }]),
    value: {
      id: 2, name: "Sports", slug: "sports", headline: "For couch potatos"
    }
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input[type=radio][value=1]+label").text().replace(/\s$/, ""), "Cooking", "123");
  assert.equal(component.$("input[type=radio][value=2]+label").text().replace(/\s$/, ""), "Sports");
  assert.equal(component.$("input[type=radio][value=3]+label").text().replace(/\s$/, ""), "Politics");
  assert.equal(component.$("input[type=radio][value=1]").attr("value"), "1");
  assert.equal(component.$("input[type=radio][value=2]").attr("value"), "2");
  assert.equal(component.$("input[type=radio][value=3]").attr("value"), "3");

  Ember.run(function() {
    component.set("optionLabelPath", "content.headline");
    component.set("optionValuePath", "content.slug");
  });

  assert.equal(component.$("input[type=radio][value=cooking]+label").text().replace(/\s$/, ""), "For kitchen geeks!");
  assert.equal(component.$("input[type=radio][value=sports]+label").text().replace(/\s$/, ""), "For couch potatos");
  assert.equal(component.$("input[type=radio][value=politics]+label").text().replace(/\s$/, ""), "For nerds");
  assert.equal(component.$("input[type=radio][value=cooking]").attr("value"), "cooking");
  assert.equal(component.$("input[type=radio][value=sports]").attr("value"), "sports");
  assert.equal(component.$("input[type=radio][value=politics]").attr("value"), "politics");
});

test("it selects given values", function(assert) {
  var collection = Ember.A([{
    id: 1, name: "Cooking"
  }, {
    id: 2, name: "Sports"
  }, {
    id: 3, name: "Politics"
  }]);
  var component = this.subject({
    collection: collection,
    value: collection[1],
    optionValuePath: "content"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.ok(component.$("div:nth-child(2) input[type=radio]").is(":checked"));

  Ember.run(function() {
    component.set("value", collection[2]);
  });

  assert.equal(component.$("input[type=radio]:checked").length, 1);
  assert.ok(component.$("div:nth-child(3) input[type=radio]").is(":checked"));

  Ember.run(function() {
    component.set("value", Ember.A([collection[2]]));
    component.set("isMultiple", true);
  });

  assert.equal(component.$("input[type=checkbox]:checked").length, 1);
  assert.ok(component.$("div:nth-child(3) input[type=checkbox]").is(":checked"));

});

test("it updates value after changing", function(assert) {
  var component = this.subject({
    collection: Ember.A([{
      id: 1, name: "Cooking"
    }, {
      id: 2, name: "Sports"
    }, {
      id: 3, name: "Politics"
    }]),
    value: {
      id: 1, name: "Cooking"
    },
    optionValuePath: "content"
  });

  Ember.run(function() {
    component.appendTo("#ember-testing");
  });

  component.$("input").attr("checked", null);
  component.$("div:nth-child(3) input").attr("checked", "checked").trigger("change");

  assert.equal(component.get("value.id"), 3);
  assert.equal(component.get("value.name"), "Politics");

  Ember.run(function() {
    component.set("value", Ember.A());
    component.set("isMultiple", true);
  });

  component.$("input").attr("checked", null);
  component.$("div:nth-child(1) input").attr("checked", "checked").trigger("change");
  component.$("div:nth-child(3) input").attr("checked", "checked").trigger("change");

  assert.equal(component.get("value.firstObject.id"), 1);
  assert.equal(component.get("value.firstObject.name"), "Cooking");
  assert.equal(component.get("value.lastObject.id"), 3);
  assert.equal(component.get("value.lastObject.name"), "Politics");

  component.$("div:nth-child(1) input").attr("checked", null).trigger("change");

  assert.equal(component.get("value.firstObject.id"), 3);
  assert.equal(component.get("value.firstObject.name"), "Politics");
});