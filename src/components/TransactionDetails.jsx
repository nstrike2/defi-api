import React from "react";
import {Box} from "@mui/material";

export class TransactionDetails extends React.Component {
   constructor(props) {
      super(props);
      console.log(props);
   }
   render() {
      return (
         <Box
            className="transaction-detail-form"
            sx={{
               width: this.props.width,
               marginTop: "7px",
               height: "100%",
               border: 1,
               borderColor: "#464646",
               borderRadius: 2,
               input: {
                  textAlign: "center",
                  color: "#BDBDBD",
               },
            }}
         >
            <div className="transaction-details">
               {this.props.children}
            </div>
         </Box>
      );
   }
}
