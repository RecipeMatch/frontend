package org.example.recipe_match_backend.domain.recipe.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.recipe_match_backend.domain.ingredient.domain.Ingredient;
import org.example.recipe_match_backend.domain.ingredient.repository.IngredientRepository;
import org.example.recipe_match_backend.domain.recipe.domain.*;
import org.example.recipe_match_backend.domain.recipe.dto.RecipeIngredientDto;
import org.example.recipe_match_backend.domain.recipe.dto.RecipeStepDto;
import org.example.recipe_match_backend.domain.recipe.dto.request.RecipeRequest;
import org.example.recipe_match_backend.domain.recipe.dto.request.RecipeUpdateRequest;
import org.example.recipe_match_backend.domain.recipe.dto.response.RecipeResponse;
import org.example.recipe_match_backend.domain.recipe.repository.RecipeIngredientRepository;
import org.example.recipe_match_backend.domain.recipe.repository.RecipeRepository;
import org.example.recipe_match_backend.domain.recipe.repository.RecipeStepRepository;
import org.example.recipe_match_backend.domain.recipe.repository.RecipeToolRepository;
import org.example.recipe_match_backend.domain.tool.domain.Tool;
import org.example.recipe_match_backend.domain.tool.repository.ToolRepository;
import org.example.recipe_match_backend.domain.user.domain.User;
import org.example.recipe_match_backend.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final ToolRepository toolRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeStepRepository recipeStepRepository;
    private final RecipeToolRepository recipeToolRepository;

    @Transactional
    public Long save(RecipeRequest recipeRequest, Long userId) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Recipe 엔티티 생성
        Recipe recipe = Recipe.builder()
                .recipeName(recipeRequest.getRecipeName())
                .description(recipeRequest.getDescription())
                .cookingTime(recipeRequest.getCookingTime())
                .category(recipeRequest.getCategory())
                .recipeIngredients(new ArrayList<>())
                .recipeSteps(new ArrayList<>())
                .recipeTools(new ArrayList<>())
                .user(user)
                .build();

        // 사용자와 레시피 관계 설정
        user.addRecipe(recipe);

        // Ingredients 처리
        for (RecipeIngredientDto dto : recipeRequest.getRecipeIngredientDtos()) {
            // 기존 Ingredient 조회 또는 새로 생성
            Ingredient ingredient = ingredientRepository.findByIngredientName(dto.getIngredientName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = Ingredient.builder()
                                .ingredientName(dto.getIngredientName())
                                .recipeIngredients(new ArrayList<>())
                                .userIngredients(new ArrayList<>())
                                .build();
                        return ingredientRepository.save(newIngredient);
                    });

            // RecipeIngredient 생성
            RecipeIngredient recipeIngredient = RecipeIngredient.builder()
                    .quantity(dto.getQuantity())
                    .ingredient(ingredient)
                    .build();

            // 양방향 관계 설정
            recipe.addRecipeIngredient(recipeIngredient);
            ingredient.addRecipeIngredient(recipeIngredient);
        }


        // Tools 처리
        for (String toolName : recipeRequest.getToolName()) {
            Tool tool = toolRepository.findByToolName(toolName)
                    .orElseGet(() -> {
                        Tool newTool = Tool.builder()
                                .toolName(toolName)
                                .recipeTools(new ArrayList<>())
                                .userTools(new ArrayList<>())
                                .build();
                        return toolRepository.save(newTool);
                    });

            // RecipeTool 생성
            RecipeTool recipeTool = RecipeTool.builder()
                    .tool(tool)
                    .build();

            // 양방향 관계 설정
            recipe.addRecipeTool(recipeTool);
            tool.addRecipeTool(recipeTool);
        }

        // RecipeSteps 처리
        for (RecipeStepDto stepDto : recipeRequest.getRecipeStepDtos()) {
            RecipeStep step = RecipeStep.builder()
                    .stepOrder(stepDto.getStepOrder())
                    .content(stepDto.getContent())
                    .build();
            recipe.addRecipeStep(step);
        }

        // Recipe 저장 (CascadeType.PERSIST에 의해 연관된 엔티티들도 함께 저장됨)
        Recipe savedRecipe = recipeRepository.save(recipe);

        return savedRecipe.getId();
    }

    @Transactional
    public Long update(Long recipeId, RecipeUpdateRequest recipeUpdateRequest){

        Recipe recipe = recipeRepository.findById(recipeId).get();

        //null체크
        if(recipeUpdateRequest.getRecipeName() != null){
            recipe.setRecipeName(recipeUpdateRequest.getRecipeName());
        }
        if(recipeUpdateRequest.getCategory() != null){
            recipe.setCategory(recipeUpdateRequest.getCategory());
        }
        if(recipeUpdateRequest.getDescription() != null){
            recipe.setDescription(recipeUpdateRequest.getDescription());
        }
        if(recipeUpdateRequest.getCookingTime() != null){
            recipe.setCookingTime(recipeUpdateRequest.getCookingTime());
        }

        if(recipeUpdateRequest.getToolName() != null){
            //수정된 toolName db에 저장(중복 제외)
            for (String toolName : recipeUpdateRequest.getToolName()) {
                Tool tool = toolRepository.findByToolName(toolName)
                        .orElseGet(() -> {
                            Tool newTool = Tool.builder()
                                    .toolName(toolName)
                                    .recipeTools(new ArrayList<>())
                                    .userTools(new ArrayList<>())
                                    .build();
                            return toolRepository.save(newTool);
                        });

                // RecipeTool 생성
                RecipeTool recipeTool = RecipeTool.builder()
                        .tool(tool)
                        .build();

                // 양방향 관계 설정
                recipe.addRecipeTool(recipeTool);
                tool.addRecipeTool(recipeTool);
            }
        }

        //기존 레시피 도구 객체 삭제
        if(recipeUpdateRequest.getDeleteToolIds() != null){
            for(Long toolId: recipeUpdateRequest.getDeleteToolIds()){
                RecipeTool recipeTool = recipeToolRepository.findById(toolId).get();
                recipeTool.getTool().getRecipeTools().remove(recipeTool);
                recipe.getRecipeTools().remove(recipeTool);
                //recipeToolRepository.deleteById(toolId); : 영속성 전파 ALL
            }
        }

        if(recipeUpdateRequest.getRecipeIngredientDtos() != null){
            //수정된 재료 db에 저장(중복 제외)
            for (RecipeIngredientDto dto : recipeUpdateRequest.getRecipeIngredientDtos()) {
                // 기존 Ingredient 조회 또는 새로 생성
                Ingredient ingredient = ingredientRepository.findByIngredientName(dto.getIngredientName())
                        .orElseGet(() -> {
                            Ingredient newIngredient = Ingredient.builder()
                                    .ingredientName(dto.getIngredientName())
                                    .recipeIngredients(new ArrayList<>())
                                    .userIngredients(new ArrayList<>())
                                    .build();
                            return ingredientRepository.save(newIngredient);
                        });

                // RecipeIngredient 생성
                RecipeIngredient recipeIngredient = RecipeIngredient.builder()
                        .quantity(dto.getQuantity())
                        .ingredient(ingredient)
                        .build();

                // 양방향 관계 설정
                recipe.addRecipeIngredient(recipeIngredient);
                ingredient.addRecipeIngredient(recipeIngredient);
            }
        }

        //기존 레시피 재료 객체 삭제
        if(recipeUpdateRequest.getDeleteIngredientIds() != null){
            for(Long ingredientId: recipeUpdateRequest.getDeleteIngredientIds()){
                RecipeIngredient recipeIngredient = recipeIngredientRepository.findById(ingredientId).get();
                recipeIngredient.getIngredient().getRecipeIngredients().remove(recipeIngredient);
                recipe.getRecipeIngredients().remove(recipeIngredient);
                //recipeIngredientRepository.deleteById(ingredientId); : 영속성 전파 ALL
            }
        }

        if(recipeUpdateRequest.getRecipeStepDtos() != null){
            for (RecipeStepDto stepDto : recipeUpdateRequest.getRecipeStepDtos()) {
                RecipeStep step = RecipeStep.builder()
                        .stepOrder(stepDto.getStepOrder())
                        .content(stepDto.getContent())
                        .build();
                recipe.addRecipeStep(step);
            }
        }

        //기존 레시피 단계 객체 삭제
        if(recipeUpdateRequest.getDeleteStepIds() != null){
            for(Long stepId: recipeUpdateRequest.getDeleteStepIds()){
                RecipeStep recipeStep = recipeStepRepository.findById(stepId).get();
                recipe.getRecipeSteps().remove(recipeStep);
                //recipeStepRepository.deleteById(stepId); : 영속성 전파 ALL
            }
        }

        return recipe.getId();
    }

    @Transactional
    public void delete(Long recipeId){
        recipeRepository.deleteById(recipeId);
    }

    public RecipeResponse find(Long recipeId){
        Recipe recipe = recipeRepository.findById(recipeId).get();
        return new RecipeResponse(recipe);
    }

    public List<RecipeResponse> findAll(){
        List<Recipe> recipes = recipeRepository.findAll();
        return recipes.stream().map(r -> new RecipeResponse(r)).collect(toList());
    }

}

