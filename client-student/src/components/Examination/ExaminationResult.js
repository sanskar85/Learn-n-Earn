import "../comps/ExaminationResult.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
 import { FetchExamDetails } from "../Controller/API";
const ExaminationResult = ({ history, setTitle }) => {

    const { exam_id } = useParams();
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [report, setReport] = useState("");
    const [marks, setMarks] = useState("");

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            const data = await FetchExamDetails(exam_id);
            if (!mounted)
                return;
            console.log(data);
            if (!data.success) {
                alert(data.message);
                history.push(`/`);
            } else {
                setMessage(data.message);
                setReport(data.report);
                setMarks(data.marks);
                setName(data.name);
            }
        }
        fetchData();
        return () => {
            mounted = false;
        }

    }, [history, exam_id])
    if (!message)
        return (<>Loading Result...</>);
    if (report === " PASS ") {
        return (<>
            <div className="examination-result-wrapper">
                <div class="status" style={{background:"#D9FFEA",color:"#06C15C"}}>You have successfully qualified the exam</div>
                <div class="content">
                    <h3>{name}</h3>
                    <p >exam-id : {exam_id}</p>
                    <h3>Marks Got - {marks}</h3>
                    <div class="pass" style={{background:"#D9FFEA",color:"#06C15C"}}>
                        {report}
                    </div>
                    <p>{message}</p>
                </div>
                <Link to={`/${localStorage.getItem("user_type")}/home`}>Return</Link>
            </div>
        </>);
    }
    else {
        return (<>
            <div className="examination-result-wrapper">
                <div class="status" style={{background:"#FFEBEB",color:"#CB3737"}}>Sorry you coldn’t qualify the exam</div>
                <div class="content">
                    <h3>{name}</h3>
                    <p >exam-id : {exam_id}</p>
                    <h3>Marks Got - {marks}</h3>
                    <div class="pass" style={{background:"#FFEBEB",color:"#CB3737"}}>
                        {report}
                    </div>
                    <p>{message}</p>
                </div>
                <Link to={`/${localStorage.getItem("user_type")}/home`}>Return</Link>
            </div>
        </>);
    }
}
export default ExaminationResult;