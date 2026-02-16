/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 65.15912897822446, "KoPercent": 34.84087102177554};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4876847290640394, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0fb8eae-d164-4959-bc4d-6f943c481eb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75ae0f94-f04c-4c89-ac7b-9bb1fbfdf34a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2d146dd-0865-4bc2-a777-202fb2efbe03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5483cad8-15a5-4d44-b1f4-d91d676e7ed9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5483cad8-15a5-4d44-b1f4-d91d676e7ed9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4e3d646-b4f9-497d-9108-a524358bfad1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99170abf-4dfe-421f-afe9-da61c5b6bb91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0fb8eae-d164-4959-bc4d-6f943c481eb2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2d146dd-0865-4bc2-a777-202fb2efbe03"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a5ae50e-f3eb-4df6-bf1c-52d7e6ccf79d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75ae0f94-f04c-4c89-ac7b-9bb1fbfdf34a"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a5ae50e-f3eb-4df6-bf1c-52d7e6ccf79d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4e3d646-b4f9-497d-9108-a524358bfad1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9558dafd-2e53-4dc7-9104-b34eeee8b8b8"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66675d05-ec6f-4883-b750-f64410a65641"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9558dafd-2e53-4dc7-9104-b34eeee8b8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8905325443786982, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bec09574-b8bf-40ac-a624-bfc5f02e1e1e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bec09574-b8bf-40ac-a624-bfc5f02e1e1e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e43295bf-f5c2-4246-9d25-f7ec30a25ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99170abf-4dfe-421f-afe9-da61c5b6bb91"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ab4aba9-e9f8-4374-8b27-86b5d711f9b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b86426d-5b99-49b8-86c5-aed77982d62b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=716d831b-b201-49c7-b722-92d956aa400b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ab4aba9-e9f8-4374-8b27-86b5d711f9b6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/716d831b-b201-49c7-b722-92d956aa400b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b86426d-5b99-49b8-86c5-aed77982d62b"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 597, 208, 34.84087102177554, 308.07537688442187, 137, 1941, 152.0, 710.8000000000004, 1017.0, 1499.3999999999996, 2.3866920927331825, 2.480265814333745, 1.142631650355605], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 55, 100.0, 798.2727272727274, 561, 1077, 869.0, 1021.8, 1060.8, 1077.0, 0.2433692929900794, 1.5651990138565626, 0.40854669399408833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 151.0, 140, 168, 149.0, 166.4, 168.0, 168.0, 0.0619400757921291, 0.048088242436272105, 0.022017761316733393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 164.53333333333333, 139, 417, 146.0, 259.2000000000001, 417.0, 417.0, 0.10044463491723361, 0.049928046067257724, 0.05041849838618953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0fb8eae-d164-4959-bc4d-6f943c481eb2", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75ae0f94-f04c-4c89-ac7b-9bb1fbfdf34a", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 210.44444444444446, 139, 448, 146.5, 434.5, 448.0, 448.0, 0.12287276525158199, 0.061076403821343, 0.06167636849542299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2d146dd-0865-4bc2-a777-202fb2efbe03", 3, 0, 0.0, 401.3333333333333, 257, 509, 438.0, 509.0, 509.0, 509.0, 0.06690156549663262, 0.03027121615895812, 0.04290237110298381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5483cad8-15a5-4d44-b1f4-d91d676e7ed9", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5483cad8-15a5-4d44-b1f4-d91d676e7ed9", 3, 0, 0.0, 565.0, 325, 935, 435.0, 935.0, 935.0, 935.0, 0.07780688331561066, 0.03520558847939414, 0.04989569014705501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4e3d646-b4f9-497d-9108-a524358bfad1", 3, 0, 0.0, 327.6666666666667, 220, 536, 227.0, 536.0, 536.0, 536.0, 0.03415533847940433, 0.02814035211307694, 0.021903000261857593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 144.0, 142, 146, 144.0, 146.0, 146.0, 146.0, 0.09043226623259179, 0.026670453517815156, 0.05590197707542051], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, 100.0, 251.98181818181828, 139, 623, 148.0, 579.4, 599.1999999999999, 623.0, 0.2502138190817608, 0.12437386124278929, 0.12095296918503083], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 524.9285714285716, 143, 804, 468.5, 790.0, 804.0, 804.0, 0.0837871805613741, 0.016504952420851038, 0.05637633535819019], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 524.9285714285716, 143, 804, 468.5, 790.0, 804.0, 804.0, 0.08414321174639236, 0.016575085796024833, 0.05661589149732845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1008.9583333333334, 265, 1603, 1067.0, 1572.5, 1599.25, 1603.0, 0.10229873788932128, 0.03181850392358284, 0.04615431338365863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99170abf-4dfe-421f-afe9-da61c5b6bb91", 3, 0, 0.0, 303.6666666666667, 230, 430, 251.0, 430.0, 430.0, 430.0, 0.018552531492922207, 0.025576162393400246, 0.011897293958677328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0fb8eae-d164-4959-bc4d-6f943c481eb2", 3, 0, 0.0, 325.3333333333333, 235, 439, 302.0, 439.0, 439.0, 439.0, 0.022696838330420573, 0.031289423935329144, 0.01455493864288038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2d146dd-0865-4bc2-a777-202fb2efbe03", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a5ae50e-f3eb-4df6-bf1c-52d7e6ccf79d", 3, 0, 0.0, 579.0, 354, 960, 423.0, 960.0, 960.0, 960.0, 0.02337231315783323, 0.02344078673153782, 0.014988104466449045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 175.00000000000003, 140, 432, 146.5, 404.2000000000001, 432.0, 432.0, 0.05911772704163071, 0.04653211718315854, 0.021014504534329664], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 437.71428571428567, 139, 723, 441.0, 651.0, 723.0, 723.0, 0.08682170542635659, 0.019609980620155038, 0.05804263565891473], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/75ae0f94-f04c-4c89-ac7b-9bb1fbfdf34a", 3, 0, 0.0, 346.6666666666667, 223, 579, 238.0, 579.0, 579.0, 579.0, 0.037519228604659886, 0.03127823712777798, 0.024060182405983066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1126.695652173913, 725, 1941, 1057.0, 1461.8000000000002, 1856.5999999999988, 1941.0, 0.10249097633795286, 0.053047087362417006, 0.047141845561695116], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 296.4285714285714, 138, 595, 232.5, 552.0, 595.0, 595.0, 0.08386899662726821, 0.15768728620894165, 0.05320205464065131], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 174.5, 140, 426, 146.5, 398.9000000000001, 426.0, 426.0, 0.05736740957462066, 0.028515636204572183, 0.02879575050913576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a5ae50e-f3eb-4df6-bf1c-52d7e6ccf79d", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4e3d646-b4f9-497d-9108-a524358bfad1", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9558dafd-2e53-4dc7-9104-b34eeee8b8b8", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 0.19219581117021278, 0.7334607712765958], "isController": false}, {"data": ["addBook", 57, 57, 100.0, 809.3333333333335, 566, 1153, 782.0, 1017.8000000000001, 1097.8, 1153.0, 0.27512972125015084, 0.9134270921322553, 0.5362691565101967], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/66675d05-ec6f-4883-b750-f64410a65641", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.8538394050802139, 1.5954002339572193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9558dafd-2e53-4dc7-9104-b34eeee8b8b8", 3, 0, 0.0, 378.6666666666667, 238, 455, 443.0, 455.0, 455.0, 455.0, 0.050741674136968694, 0.03321663629213673, 0.03253941993809516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 181.22222222222223, 141, 446, 150.0, 419.90000000000003, 446.0, 446.0, 0.11949176170687344, 0.08926874775952946, 0.042475587169240166], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 479.0, 142, 1303, 425.0, 1121.5, 1303.0, 1303.0, 0.08444825131799591, 0.01663517450627933, 0.05736307696251704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, 8.875739644970414, 211.15976331360952, 140, 718, 152.0, 415.0, 464.5, 649.4000000000011, 0.6972436185706092, 1.5336128345944229, 0.33340828358424474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 244.33333333333334, 140, 446, 154.0, 446.0, 446.0, 446.0, 0.03620870698707349, 0.02804053187573172, 0.012871063811811282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bec09574-b8bf-40ac-a624-bfc5f02e1e1e", 3, 0, 0.0, 515.6666666666666, 219, 839, 489.0, 839.0, 839.0, 839.0, 0.08609309533375423, 0.03895488363083281, 0.05520943939046089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bec09574-b8bf-40ac-a624-bfc5f02e1e1e", 1, 0, 0.0, 1303.0, 1303, 1303, 1303.0, 1303.0, 1303.0, 1303.0, 0.7674597083653109, 0.1386523887183423, 0.5291274942440523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, 100.0, 213.11111111111111, 144, 444, 149.0, 444.0, 444.0, 444.0, 0.05739686102944459, 0.028530275648425096, 0.02881053375892043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 189.8571428571428, 141, 437, 151.0, 424.8, 436.0, 437.0, 0.1112146761004957, 0.09025331624952336, 0.03953334189509808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 534.0, 181, 1017, 487.0, 879.4, 989.7999999999996, 1017.0, 0.10548958634322642, 0.06479780254872014, 0.04769695163761117], "isController": false}, {"data": ["login", 23, 9, 39.130434782608695, 1971.1304347826087, 1226, 2583, 2044.0, 2394.2000000000003, 2554.9999999999995, 2583.0, 0.10063135235411735, 0.15303212109014383, 0.1504471190447022], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, 100.0, 218.16666666666669, 140, 573, 149.5, 573.0, 573.0, 573.0, 0.03580785504980276, 0.017799021699560158, 0.017973864741795523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e43295bf-f5c2-4246-9d25-f7ec30a25ca6", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 185.46666666666664, 142, 417, 150.0, 417.0, 417.0, 417.0, 0.09453702069730507, 0.07653436538873623, 0.03360495657599516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 11, 100.0, 145.0, 139, 150, 146.0, 149.8, 150.0, 150.0, 0.06381028621813838, 0.03171819891116448, 0.032029772574338984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99170abf-4dfe-421f-afe9-da61c5b6bb91", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ab4aba9-e9f8-4374-8b27-86b5d711f9b6", 3, 0, 0.0, 429.66666666666663, 277, 723, 289.0, 723.0, 723.0, 723.0, 0.0876372984342136, 0.03965359532016827, 0.05619969984225286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 181.88888888888889, 146, 449, 147.0, 449.0, 449.0, 449.0, 0.06247093366280967, 0.05179474871066934, 0.022206464700451872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 22, 100.0, 159.7272727272727, 139, 432, 146.0, 153.4, 390.2999999999994, 432.0, 0.10204602275626308, 0.050724048420837796, 0.051222320016327365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b86426d-5b99-49b8-86c5-aed77982d62b", 3, 0, 0.0, 314.6666666666667, 223, 468, 253.0, 468.0, 468.0, 468.0, 0.025544959128065398, 0.030193276886069483, 0.01638137027418256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 192.72727272727272, 141, 453, 153.0, 430.7, 450.59999999999997, 453.0, 0.10172516634376633, 0.07897608129227952, 0.03616011772376069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=716d831b-b201-49c7-b722-92d956aa400b", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ab4aba9-e9f8-4374-8b27-86b5d711f9b6", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, 100.0, 160.47619047619048, 138, 447, 143.0, 175.00000000000003, 420.2999999999996, 447.0, 0.10675342500571892, 0.05306395832803802, 0.05358521528607376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 145.61538461538458, 137, 159, 146.0, 155.8, 159.0, 159.0, 0.11588725061955107, 0.05760411188022607, 0.06568279040899286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/716d831b-b201-49c7-b722-92d956aa400b", 3, 0, 0.0, 459.6666666666667, 341, 595, 443.0, 595.0, 595.0, 595.0, 0.016995145053563032, 0.023429179460234196, 0.010898579347499732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b86426d-5b99-49b8-86c5-aed77982d62b", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["register", 24, 9, 37.5, 1008.9583333333334, 265, 1603, 1067.0, 1572.5, 1599.25, 1603.0, 0.10512483574244415, 0.0326975197109067, 0.047429369250985544], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 4.326923076923077, 1.5075376884422111], "isController": false}, {"data": ["401/Unauthorized", 19, 9.134615384615385, 3.1825795644891124], "isController": false}, {"data": ["404/Not Found", 180, 86.53846153846153, 30.150753768844222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 597, 208, "404/Not Found", 180, "401/Unauthorized", 19, "406/Not Acceptable", 9, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, "404/Not Found", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
