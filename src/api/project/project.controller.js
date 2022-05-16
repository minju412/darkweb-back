const db = require("../../models");
const Project = db.projects;
const Keyword = db.keywords;

// 프로젝트 생성
const createProject = async (req, res) => {
    try{
        let project = await Project.findOne({
            where: {
                projectName: req.body.projectName,
                user_id: req.id
            }
        });
        if (!project){
            project = await Project.create({
                projectName: req.body.projectName,
                targetDomain: req.body.targetDomain,
                description: req.body.description,
                user_id: req.id, // 해당 프로젝트를 생성한 사용자 id
            });
            // await project.addUser(req.id);
            res.status(200).json({ ProjectId: project.id, UserId: req.id });
        }
        else{
            res.status(403).send({
                message: "프로젝트 이름 중복",
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: "프로젝트 생성 실패",
        });
    }
};

// 프로젝트 수정
const patchProject = async (req, res) => {
    try{
        const project = await Project.findOne({
            where: {
                id: req.params.projectId,
                user_id: req.id
            }
        });
        if(project){
            await Project.update(
                {
                    projectName: req.body.projectName,
                    targetDomain: req.body.targetDomain,
                    description: req.body.description
                },
                { where: { id: req.params.projectId }}
            );
            res.status(200).send('프로젝트 수정 성공');
        }
       else{
            res.status(403).send({
                message: "존재하지 않는 프로젝트입니다.",
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: "프로젝트 수정 실패",
       });
    }
};

// 프로젝트 제거
const deleteProject = async (req, res) => {
    try{
        const project = await Project.findOne({
            where: {
                id: req.params.projectId,
                user_id: req.id
            }
        });
        if(project) {
            await Project.destroy({
                where: { id: req.params.projectId }
            });
            res.json({ ProjectId: parseInt(req.params.projectId, 10) }); // params는 문자열!
        }
        else{
            res.status(403).send({
                message: "존재하지 않는 프로젝트입니다.",
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: "프로젝트 제거 실패",
        });
    }
};

// 키워드 추가
const createKeyword = async (req, res) => {
    try{
        const project = await Project.findOne({
            where: {
                id: req.params.projectId,
                user_id: req.id
            }
        });
        if(project) {
            let keyword = await Keyword.findOne({
                where: {
                    keyword: req.body.keyword,
                },
            });
            if (!keyword){
                keyword = await Keyword.create({
                    keyword: req.body.keyword,
                });
            }

            await project.addKeyword(keyword.id); // project의 키워드로 req.body.keyword를 추가한다.
            res.status(200).json({ ProjectId: parseInt(req.params.projectId, 10) });
        } else{
            res.status(403).send({
                message: "존재하지 않는 프로젝트입니다.",
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({
            message: "키워드 생성 실패",
        });
    }
};


module.exports = {
    createProject,
    patchProject,
    deleteProject,
    createKeyword,
};