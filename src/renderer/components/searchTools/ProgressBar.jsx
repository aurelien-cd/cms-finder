import { Progress } from "../ui/progress"

const ProgressBar = ({progress}) => {
    <div className="mt-24">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-center">Recherche en cours...</h2>
        <Progress value={progress} />
    </div>
}

export default ProgressBar;