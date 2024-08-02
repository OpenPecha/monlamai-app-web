import React, { useState } from "react";
import { Accordion, Button } from "flowbite-react";
import { SubmitButton } from "~/component/Buttons";
import ToolWraper from "~/component/ToolWraper";

const jobList = [
  {
    title: "UI/UX Developer",
    skill: "HTML, CSS, JavaScript, Design Principles, Figma",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSephyFkhDhlt8xXPQobBPNYoApzZSq_TsdrzKuY5Ql0zk25qA/viewform?usp=pp_url&entry.795181689=FrontEnd+/+Javascript&entry.1652784337=UI/UX+Developer",
    description:
      "A UI/UX Developer is responsible for creating visually appealing and user-friendly interfaces for web and mobile applications. They collaborate with designers and front-end developers to ensure a seamless user experience, utilizing their expertise in HTML, CSS, JavaScript, and design principles.",
  },
  {
    title: "Python Developer",
    skill: "Python, Django, Flask, SQL",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSephyFkhDhlt8xXPQobBPNYoApzZSq_TsdrzKuY5Ql0zk25qA/viewform?usp=pp_url&entry.795181689=Python&entry.1652784337=Python+Developer",
    description:
      "A Python Developer specializes in writing server-side applications and software using the Python programming language. They work on various projects, from web development and data analysis to machine learning and automation, utilizing their knowledge of Python libraries, frameworks, and best coding practices.",
  },
  {
    title: "Fullstack Developer",
    skill: "HTML, CSS, JavaScript, Python, Node.js",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSephyFkhDhlt8xXPQobBPNYoApzZSq_TsdrzKuY5Ql0zk25qA/viewform?usp=pp_url&entry.795181689=Full+Stack+(NextJS+/+Remix+Run)&entry.1652784337=FullStack+Developer",
    description:
      "A Fullstack Developer is a versatile professional who can work on both the front-end and back-end aspects of web applications. They are proficient in a variety of programming languages and technologies, including HTML, CSS, JavaScript, and server-side scripting languages like Python or Node.js. Fullstack Developers are responsible for designing, developing, and maintaining the entire web application, ensuring its functionality and user experience.",
  },
];

function Jobs() {
  const [selectedJob, setSelectedJob] = useState(1);

  return (
    <ToolWraper title="jobs">
      {/* <div className="flex flex-1 flex-col">
        <div className="flex-1 p-5">
          <h3 className="leading-[24px] font-poppins font-medium text-[24px] my-6">
            Jobs
          </h3>
          <ol>
            {jobList.map((job, index) => (
              <div key={job.title}>
                <li
                  onClick={() => setSelectedJob(index + 1)}
                  className="my-2 flex items-center gap-2 cursor-pointer font-poppins leading-normal"
                  style={{
                    transition: "all 0.2s ease-in-out",
                    opacity: selectedJob === index + 1 ? 1 : 0.5,
                  }}
                >
                  <span className="flex justify-center items-center bg-secondary-500 dark:bg-primary-500  p-2 h-5 text-white w-5 rounded-full text-sm">
                    {index + 1}
                  </span>{" "}
                  {job.title}
                </li>
                {selectedJob === index + 1 && (
                  <div className="text-sm text-gray-500 md:hidden">
                    <h5 className="font-poppins leading-normal">
                      {job.description}
                    </h5>
                    <a href={jobList[selectedJob - 1].link}>
                      <Button className="bg-secondary-500 dark:bg-primary-500 mt-4 dark:text-black">
                        Apply
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </ol>
        </div>
        {selectedJob && (
          <div className="flex-1 hidden md:flex flex-col p-5">
            <h3 className="leading-[24px] font-poppins font-medium text-[24px] my-10">
              Description
            </h3>
            <h5 className="font-poppins leading-normal">
              {jobList[selectedJob - 1].description}
            </h5>
            <p className="mt-5">Skills : {jobList[selectedJob - 1].skill}</p>
            <a href={jobList[selectedJob - 1].link}>
              <SubmitButton
                size="md"
                className="bg-secondary-500 dark:bg-primary-500  mt-10 dark:text-black"
              >
                Apply
              </SubmitButton>
            </a>
          </div>
        )}
      </div> */}

      <h3 className="leading-[24px] font-poppins font-medium text-[24px] mb-6">
        Jobs
      </h3>
      <Accordion>
        {jobList.map((job, index) => (
          <Accordion.Panel key={index}>
            <Accordion.Title className="dark:bg-[--card-bg] dark:border-b-[--card-border]">
              {job.title}
            </Accordion.Title>
            <Accordion.Content className="bg-neutral dark:bg-[--card-bg] dark:border-b-[--card-border]">
              <p className="mb-2 text-black dark:text-dark_text-secondary">
                {job.description}
              </p>
              <Button className="bg-secondary-500 dark:bg-primary-500 dark:text-black">
                Apply
              </Button>
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    </ToolWraper>
  );
}

export default Jobs;
