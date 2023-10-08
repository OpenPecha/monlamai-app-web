import React from "react";
import Header from "~/component/Mainpage/Header";

function About() {
  return (
    <>
      <div className="text-white">
        <Header />
        <div className="h-screen py-[160px] m-auto max-w-[1140px]">
          <div className="flex flex-col justify-center items-center gap-10 px-4 lg:flex-row">
            <img
              src="/assets/about.jpg"
              alt="monalm"
              className="w-[80%] sm:w-[60%] md:w-[50%] border-[#dddcdc] rounded-xl"
            />
            <div className="text-sm leading-7">
              <h4 className="text-[1.5rem] mb-4">
                སྨོན་ལམ་མིས་བཟོས་རིག་ནུས་ཀྱི་ལས་གཞི།
              </h4>
              <p className="mb-4">
                ཕྱི་ལོ་༢༠༢༣ ལོར་སྨོན་ལམ་བོད་ཀྱི་བརྡ་འཕྲིན་ཞིབ་འཇུག་ཁང་དང་།
                འབྲེལ་ཡོད་སློབ་ཆེན་དང་།
                ཚོགས་པ་རེ་འགས་མཉམ་འབྲེལ་ངང་བོད་ཀྱི་སྐད་ཡིག་གི་སྐོར་བརྡ་ཕྲིན་ལག་རྩལ་འཕེལ་རྒྱས་གཏོང་བའི་ལས་གཞིའི་ནང་།
                <ol className="list-decimal ml-5">
                  <li>སྨོན་ལམ་ཡིག་སྒྱུར་རིག་ནུས།</li>
                  <li>སྨོན་ལམ་ཡིག་གཟུགས་ངོས་འཛིན་རིག་ནུས།</li>
                  <li>སྨོན་ལམ་འབྲི་ཀློག་རིག་ནུས།</li>
                </ol>
              </p>
              <p>
                ལས་གཞི་འདི་ནི་མིས་བཟོས་རིག་ནུས་(AI) མཉེན་ཆས་ཡིན་པས།
                འཕྲུལ་ཆས་རང་ལ་ཡིག་གཟུགས་དང་། སྐད་གདངས།
                ཡི་གེ་ཀློག་ཚུལ་བཅས་ངོས་འཛིན་པའི་ནུས་པ་ཡོད་པ་ཞིག་བཟོ་དགོས་པས།
                དེའི་ཆེད་དུ་པར་རིས་དང་། ཡིག་གཟུགས།
                སྒྲ་གདངས་སོགས་རྒྱུ་ཆ་ཤིན་ཏུ་མང་པོ་གསོག་སྒྲུབ་བྱ་དགོས་ན།
                མི་གྲངས་བརྒྱ་ཕྲག་བརྒལ་པས་ལོ་གསུམ་རིང་བསྒྲུབ་དགོས་པས།
                དུས་ཡུན་རིང་ཞིང་གཞི་རྒྱ་ཆེ་བའི་བྱ་བ་ཞིག་ཡིན།
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
