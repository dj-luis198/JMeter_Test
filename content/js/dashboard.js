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

    var data = {"OkPercent": 61.70542635658915, "KoPercent": 38.29457364341085};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4610983981693364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3b5eae9-7208-41ca-baf8-a7dc50754d52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13e52df7-e01f-45ce-b418-71cac4aca4f3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b3889a9-38aa-401f-aa5f-4e1ab3fa35df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8e310fc-28eb-4d5f-9a59-64ee1f416633"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=debe2732-803f-4362-821a-c46104b861ef"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3b5eae9-7208-41ca-baf8-a7dc50754d52"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/57c9bbfa-fc26-453b-8d9d-3c37b21da695"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/debe2732-803f-4362-821a-c46104b861ef"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8e310fc-28eb-4d5f-9a59-64ee1f416633"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a22beb5-ad9c-4cdf-8493-96e5f2f730f4"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d7a3b3e-1f92-4154-bd8c-3764cf4d5b99"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21c8bdfd-f471-45fd-b3a9-2c6f5a39be77"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a22beb5-ad9c-4cdf-8493-96e5f2f730f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c943f24-31b4-45b6-a31a-9d5c72df00f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d7a3b3e-1f92-4154-bd8c-3764cf4d5b99"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c47d94b4-5b8f-43e1-8d39-49ab17c48444"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c47d94b4-5b8f-43e1-8d39-49ab17c48444"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caf7d8aa-13e7-43d7-95f3-dd63417a07e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/067e318d-345d-43d2-82c0-0f8607892e01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caf7d8aa-13e7-43d7-95f3-dd63417a07e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c943f24-31b4-45b6-a31a-9d5c72df00f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b3889a9-38aa-401f-aa5f-4e1ab3fa35df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21c8bdfd-f471-45fd-b3a9-2c6f5a39be77"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 645, 247, 38.29457364341085, 287.3178294573644, 139, 1710, 153.0, 601.0, 936.9999999999986, 1315.4199999999992, 2.5602248234635674, 2.5628878480119557, 1.2243555775192414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 56, 100.0, 824.7499999999999, 581, 1073, 897.0, 1056.9, 1071.15, 1073.0, 0.2558315897192248, 1.6444442715423904, 0.42946728781967525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 180.75, 141, 464, 150.5, 423.2000000000006, 463.4, 464.0, 0.11538883151499765, 0.0895841025922101, 0.041017123702596824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 168.23529411764707, 143, 481, 150.0, 220.99999999999977, 481.0, 481.0, 0.09963311570335118, 0.04952466395801343, 0.050011153780783704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3b5eae9-7208-41ca-baf8-a7dc50754d52", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13e52df7-e01f-45ce-b418-71cac4aca4f3", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b3889a9-38aa-401f-aa5f-4e1ab3fa35df", 3, 0, 0.0, 789.0, 235, 1221, 911.0, 1221.0, 1221.0, 1221.0, 0.044937088076692625, 0.04506873970191731, 0.02881707796584781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8e310fc-28eb-4d5f-9a59-64ee1f416633", 3, 0, 0.0, 325.3333333333333, 233, 417, 326.0, 417.0, 417.0, 417.0, 0.020973007739039855, 0.02478938512384561, 0.013449487384735845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=debe2732-803f-4362-821a-c46104b861ef", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 22, 100.0, 160.86363636363635, 140, 435, 149.0, 153.4, 392.8499999999994, 435.0, 0.1569097341093233, 0.07799517056801324, 0.07876133137909391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 269.6, 154, 444, 160.0, 444.0, 444.0, 444.0, 0.04975916563831058, 0.014675066428486127, 0.030759327977588475], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 267.42857142857144, 144, 608, 151.0, 600.3, 604.0, 608.0, 0.2556423928127967, 0.12707224408370463, 0.12357713324446716], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 402.46666666666664, 147, 1029, 449.0, 730.8000000000002, 1029.0, 1029.0, 0.09120148840829082, 0.019950325589313617, 0.060533800411622714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 402.46666666666664, 147, 1029, 449.0, 730.8000000000002, 1029.0, 1029.0, 0.09041645820649913, 0.019778600232671684, 0.060012746836930905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 895.125, 182, 1667, 874.0, 1466.0, 1635.25, 1667.0, 0.09526417947771414, 0.02935141467306524, 0.042980518475296804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3b5eae9-7208-41ca-baf8-a7dc50754d52", 3, 0, 0.0, 575.6666666666666, 301, 1003, 423.0, 1003.0, 1003.0, 1003.0, 0.04671441918405481, 0.030032870406415446, 0.029956837823108068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57c9bbfa-fc26-453b-8d9d-3c37b21da695", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.4621359442836469, 0.8635017185238785], "isController": false}, {"data": ["deleteAccount", 14, 5, 35.714285714285715, 462.92857142857144, 144, 1221, 444.5, 1112.0, 1221.0, 1221.0, 0.08605323006945724, 0.025270933216546807, 0.055962211491179546], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 234.0, 147, 453, 152.0, 453.0, 453.0, 453.0, 0.04718698178582503, 0.03714131574157712, 0.016773497431679992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/debe2732-803f-4362-821a-c46104b861ef", 3, 0, 0.0, 301.3333333333333, 232, 428, 244.0, 428.0, 428.0, 428.0, 0.03251926766609216, 0.03261453895808267, 0.0208538272468104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1064.8636363636365, 725, 1710, 1010.0, 1343.5, 1656.1499999999992, 1710.0, 0.09826561194909841, 0.05086013118459195, 0.04519834299611851], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 218.4, 144, 301, 232.0, 294.4, 301.0, 301.0, 0.09096753065605782, 0.15401110903065, 0.056232858305942], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 148.28571428571428, 144, 152, 150.0, 152.0, 152.0, 152.0, 0.04475846414527319, 0.022248103759710987, 0.022466650947920327], "isController": false}, {"data": ["addBook", 68, 68, 100.0, 798.529411764706, 578, 1398, 771.5, 1021.6, 1139.5, 1398.0, 0.31540912738354215, 0.968132806955699, 0.6142215888270955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8e310fc-28eb-4d5f-9a59-64ee1f416633", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a22beb5-ad9c-4cdf-8493-96e5f2f730f4", 3, 0, 0.0, 313.6666666666667, 226, 483, 232.0, 483.0, 483.0, 483.0, 0.0906043308870164, 0.04099610023859141, 0.05810238666908279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 193.54545454545456, 143, 506, 153.0, 433.1, 495.1999999999998, 506.0, 0.1686663855560241, 0.1260056493655844, 0.05995562924061793], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 397.66666666666663, 154, 741, 423.0, 686.4000000000001, 741.0, 741.0, 0.09031193743188974, 0.019755736313225882, 0.06011976303652816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 192, 27, 14.0625, 211.3020833333332, 140, 947, 154.0, 428.2000000000001, 452.35, 689.389999999998, 0.8370973648872534, 1.6640060599636386, 0.4056393440121379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 180.29999999999998, 143, 457, 151.5, 426.8000000000001, 457.0, 457.0, 0.065186073647226, 0.05048101211157248, 0.02317161211678737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, 100.0, 184.3125, 139, 449, 147.5, 442.0, 449.0, 449.0, 0.07952602489164579, 0.03953002604477315, 0.03991833671318939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d7a3b3e-1f92-4154-bd8c-3764cf4d5b99", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21c8bdfd-f471-45fd-b3a9-2c6f5a39be77", 3, 0, 0.0, 563.3333333333334, 256, 973, 461.0, 973.0, 973.0, 973.0, 0.022997493273233218, 0.027182258487991474, 0.01474774145451479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 183.3846153846154, 141, 593, 150.0, 417.39999999999986, 593.0, 593.0, 0.07322664774039464, 0.05942514089088666, 0.026029784938968403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a22beb5-ad9c-4cdf-8493-96e5f2f730f4", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c943f24-31b4-45b6-a31a-9d5c72df00f5", 3, 0, 0.0, 443.33333333333337, 231, 753, 346.0, 753.0, 753.0, 753.0, 0.0420952193862517, 0.027063170015575233, 0.026994655661105423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d7a3b3e-1f92-4154-bd8c-3764cf4d5b99", 3, 0, 0.0, 329.6666666666667, 234, 465, 290.0, 465.0, 465.0, 465.0, 0.02662524961171511, 0.026703253272686932, 0.01707413467938762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 483.68181818181813, 160, 915, 527.0, 758.9, 894.5999999999997, 915.0, 0.09860341705659836, 0.060567919266211294, 0.044583380954301796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c47d94b4-5b8f-43e1-8d39-49ab17c48444", 3, 0, 0.0, 375.6666666666667, 283, 512, 332.0, 512.0, 512.0, 512.0, 0.027155956659093174, 0.02723551512586786, 0.01741446439401483], "isController": false}, {"data": ["login", 22, 9, 40.90909090909091, 1890.5454545454547, 1342, 2389, 2026.5, 2252.2, 2369.2, 2389.0, 0.09968463406677058, 0.15190755892721208, 0.14896941097709065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c47d94b4-5b8f-43e1-8d39-49ab17c48444", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 204.1, 144, 431, 149.0, 430.8, 431.0, 431.0, 0.06119276946236033, 0.030417109039395904, 0.030715901859036335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 201.64705882352942, 146, 453, 151.0, 449.8, 453.0, 453.0, 0.09845369780506168, 0.07970519089882436, 0.03499721289164302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 162.9, 141, 449, 148.0, 152.9, 434.1999999999998, 449.0, 0.1111827622245447, 0.055265650363567634, 0.05580853494474217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caf7d8aa-13e7-43d7-95f3-dd63417a07e4", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/067e318d-345d-43d2-82c0-0f8607892e01", 1, 0, 0.0, 901.0, 901, 901, 901.0, 901.0, 901.0, 901.0, 1.1098779134295227, 0.35442390399556045, 0.6622416065482797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caf7d8aa-13e7-43d7-95f3-dd63417a07e4", 2, 0, 0.0, 274.5, 256, 293, 274.5, 293.0, 293.0, 293.0, 0.018133517086306474, 0.03071541541620955, 0.01127146838421296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c943f24-31b4-45b6-a31a-9d5c72df00f5", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 190.49999999999997, 145, 449, 153.5, 446.9, 449.0, 449.0, 0.08311213385209157, 0.06890840003947826, 0.029543766330235675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 163.78947368421055, 144, 433, 150.0, 155.0, 433.0, 433.0, 0.08834784872988342, 0.04391509277686589, 0.04434647875699227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 182.6842105263158, 146, 441, 154.0, 433.0, 441.0, 441.0, 0.0871723581040471, 0.06767775848898187, 0.03098704916979799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 19, 100.0, 147.31578947368422, 142, 153, 147.0, 152.0, 153.0, 153.0, 0.09125270756388891, 0.045359011865253374, 0.05206132061878942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 13, 100.0, 192.15384615384616, 141, 445, 149.0, 438.6, 445.0, 445.0, 0.07329600875041581, 0.03643326997457192, 0.036791160642298565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b3889a9-38aa-401f-aa5f-4e1ab3fa35df", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21c8bdfd-f471-45fd-b3a9-2c6f5a39be77", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 895.125, 182, 1667, 874.0, 1466.0, 1635.25, 1667.0, 0.09465737972596688, 0.029164456351115774, 0.04270674749355147], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 4.4534412955465585, 1.7054263565891472], "isController": false}, {"data": ["401/Unauthorized", 37, 14.979757085020243, 5.736434108527132], "isController": false}, {"data": ["404/Not Found", 199, 80.56680161943319, 30.852713178294575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 645, 247, "404/Not Found", 199, "401/Unauthorized", 37, "406/Not Acceptable", 11, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 192, 27, "401/Unauthorized", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
