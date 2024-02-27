import {Component, OnDestroy, OnInit} from '@angular/core';

import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from "../service/shopping-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private ingredientChangeSubscription: Subscription;

  constructor(private shoppingList: ShoppingListService) {
  }

  ngOnInit() {
    this.ingredients = this.shoppingList.getIngredients();
    this.ingredientChangeSubscription = this.shoppingList.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy() {
    this.ingredientChangeSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingList.startedEditing.next(index);
  }
}
