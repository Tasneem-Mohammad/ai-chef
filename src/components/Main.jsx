import {useState , useRef , useEffect} from "react"
import IngredientsList from "./IngredientsList";
import { getRecipeFromAI } from "../ai";
import GeneratedRecipe from "./GeneratedRecipe";
export default function Main(){

    const [ingredients , setIngredients] =  useState(["chicken" , "paneer" , "spices","chilli","apple"])
    const [recipe , setRecipe] = useState("")
    const displayRecepie = useRef(null);
    async function getRecipe(){
        const generatedText = await getRecipeFromAI(ingredients)
        console.log(generatedText)
        setRecipe(generatedText)
    }
    function handleAction(formData){
        const newIngredient = formData.get("ingredient");
        setIngredients( prevIngredients => [...prevIngredients , newIngredient])
    }


    useEffect(()=>{
        if(recipe !== "" && displayRecepie.current!= null){
            //displayRecepie.current.scrollIntoView({ behavior: "smooth" })
            const yCoord = displayRecepie.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
    }, [recipe])

    return(
        <main>
            <form action = {handleAction} className="add-ingredient">
                <input type="text" placeholder="e.g. chicken" aria-label="Add ingredient" name = "ingredient"/>
                <button> Add ingredient</button>
            </form>
            {ingredients.length > 0 && <IngredientsList ingredients = {ingredients} getRecipe={getRecipe} refTarget= {displayRecepie}/>}
            {recipe && <GeneratedRecipe recipe ={recipe}/>}
        </main>
    )
}