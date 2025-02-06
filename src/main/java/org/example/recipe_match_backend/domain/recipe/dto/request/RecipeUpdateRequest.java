package org.example.recipe_match_backend.domain.recipe.dto.request;

import lombok.*;
import org.example.recipe_match_backend.domain.recipe.dto.RecipeIngredientDto;
import org.example.recipe_match_backend.domain.recipe.dto.RecipeStepDto;
import org.example.recipe_match_backend.type.CategoryType;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
public class RecipeUpdateRequest {

    private String recipeName;//Recipe

    private String description;//Recipe

    private Integer cookingTime;//Recipe

    private CategoryType category;//Recipe

    private List<RecipeIngredientDto> recipeIngredientDtos = new ArrayList<>();//RecipeIngredient

    private List<RecipeStepDto> recipeStepDtos = new ArrayList<>();//RecipeStep

    private List<String> toolName = new ArrayList<>();//RecipeTool

    private List<Long> deleteToolIds = new ArrayList<>();

    private List<Long> deleteIngredientIds = new ArrayList<>();

    private List<Long> deleteStepIds= new ArrayList<>();
}
