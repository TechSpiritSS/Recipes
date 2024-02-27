import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../../service/shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  @ViewChild('f', {static: false}) slForm: NgForm;

  constructor(private shoppingList: ShoppingListService) {
  }

  ngOnInit() {
    this.subscription = this.shoppingList.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editItemIndex = index;
      this.editedItem = this.shoppingList.getIngredient(index);

      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) this.shoppingList.updateIngredient(this.editItemIndex, newIngredient);
    else this.shoppingList.addIngredient(newIngredient);
    this.editMode = false;
    form.reset();
  }


  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingList.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
