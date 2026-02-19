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

    var data = {"OkPercent": 69.17057902973396, "KoPercent": 30.829420970266042};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5319634703196348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0304a0d-11f5-4c00-b1ed-4a4ad37ecb2c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dd20faa-b406-4d3a-8322-98354a9d3dd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0304a0d-11f5-4c00-b1ed-4a4ad37ecb2c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b510fba-632d-4fa0-98f4-1ebf8caf2481"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd80f50c-5a87-4b71-b340-313b1a8795d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43e408a5-4b7c-4470-b194-f1b6da378763"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e926206c-8d81-4f49-be26-6d4f4fbef558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31a44b43-f3de-4a69-be53-606cc2d9a60f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=824643f8-8fbe-43e0-a6bc-f17529ac2af1"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43e408a5-4b7c-4470-b194-f1b6da378763"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5d5468a-319d-48f6-8b0c-20c2ab60af90"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1aa889c0-2d0c-4022-b05d-d1176b4c790b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ade71850-5a86-47cf-b316-9331055e967e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc12aab0-1c63-4577-828e-655439574584"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3dd20faa-b406-4d3a-8322-98354a9d3dd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55280f06-9378-4bf6-9a87-b5ee6ddd4561"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d456317d-fb8e-4410-beac-8b791e1e09d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5d5468a-319d-48f6-8b0c-20c2ab60af90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a83984b-d95a-4da6-a57c-7b4a59d8864c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9413407821229051, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a83984b-d95a-4da6-a57c-7b4a59d8864c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b4d967e-6ab6-4bfc-87e7-ccbc727ea825"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55280f06-9378-4bf6-9a87-b5ee6ddd4561"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d456317d-fb8e-4410-beac-8b791e1e09d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bb0dba6-85b5-4d75-8205-f2c7c3a1a5be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1aa889c0-2d0c-4022-b05d-d1176b4c790b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c6e38db-46d2-4e40-9ee1-e42b4fc0efe5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ade71850-5a86-47cf-b316-9331055e967e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b4d967e-6ab6-4bfc-87e7-ccbc727ea825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c6e38db-46d2-4e40-9ee1-e42b4fc0efe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b510fba-632d-4fa0-98f4-1ebf8caf2481"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7d2c1ec-7dfa-42d8-b900-78974377675f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/824643f8-8fbe-43e0-a6bc-f17529ac2af1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e926206c-8d81-4f49-be26-6d4f4fbef558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd80f50c-5a87-4b71-b340-313b1a8795d6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d7d2c1ec-7dfa-42d8-b900-78974377675f"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 639, 197, 30.829420970266042, 266.70579029733955, 96, 2495, 103.0, 671.0, 968.0, 1460.2000000000032, 2.5147183830242734, 2.595071186403992, 1.214265830870431], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 564.3333333333334, 393, 1112, 589.0, 738.2, 848.7999999999998, 1112.0, 0.24372723074554875, 1.5673905793011442, 0.409147568019139], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 121.11764705882354, 96, 290, 99.0, 288.4, 290.0, 290.0, 0.07292913433117548, 0.036250907592351875, 0.03660700688107832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 112.82352941176472, 98, 292, 100.0, 147.9999999999999, 292.0, 292.0, 0.11725270026071484, 0.0910311491281917, 0.041679670795800976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0304a0d-11f5-4c00-b1ed-4a4ad37ecb2c", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 153.7894736842105, 97, 544, 99.0, 294.0, 544.0, 544.0, 0.12154865784692546, 0.06041822933992681, 0.06101172864582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dd20faa-b406-4d3a-8322-98354a9d3dd4", 3, 0, 0.0, 311.0, 179, 385, 369.0, 385.0, 385.0, 385.0, 0.025410592829130704, 0.025485037925309796, 0.01629520438586832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0304a0d-11f5-4c00-b1ed-4a4ad37ecb2c", 3, 0, 0.0, 329.0, 183, 444, 360.0, 444.0, 444.0, 444.0, 0.05030518478771212, 0.032341386704339656, 0.03225950977597424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 2.94921875, 6.181640625], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 203.70175438596488, 97, 794, 100.0, 394.0, 465.69999999999936, 794.0, 0.2384268845135464, 0.11851492599354992, 0.11525518343184128], "isController": false}, {"data": ["deleteBook", 17, 1, 5.882352941176471, 560.0588235294117, 110, 1709, 432.0, 1056.1999999999994, 1709.0, 1709.0, 0.08760854440980184, 0.016416536756937824, 0.05929983219098663], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, 5.882352941176471, 560.0588235294117, 110, 1709, 432.0, 1056.1999999999994, 1709.0, 1709.0, 0.08682639318055294, 0.016269973262578334, 0.058770415374911254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 5, 18.51851851851852, 877.7037037037038, 279, 1922, 839.0, 1378.9999999999998, 1795.9999999999993, 1922.0, 0.11036986166977338, 0.03506542480133425, 0.04979577743304228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b510fba-632d-4fa0-98f4-1ebf8caf2481", 3, 0, 0.0, 238.66666666666669, 170, 367, 179.0, 367.0, 367.0, 367.0, 0.042957171699815284, 0.027225785579277458, 0.0275474050288529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd80f50c-5a87-4b71-b340-313b1a8795d6", 3, 0, 0.0, 249.66666666666666, 190, 367, 192.0, 367.0, 367.0, 367.0, 0.052014702822664544, 0.03235680243948956, 0.03335578273458631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43e408a5-4b7c-4470-b194-f1b6da378763", 3, 0, 0.0, 266.0, 181, 382, 235.0, 382.0, 382.0, 382.0, 0.03329079509515619, 0.027753166093325198, 0.021348589302557845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e926206c-8d81-4f49-be26-6d4f4fbef558", 3, 0, 0.0, 457.0, 304, 698, 369.0, 698.0, 698.0, 698.0, 0.05877512636652169, 0.03778674302535167, 0.03769108038478116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31a44b43-f3de-4a69-be53-606cc2d9a60f", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 248.4, 102, 493, 109.0, 493.0, 493.0, 493.0, 0.026131493676178532, 0.020568343655273335, 0.009288929392704088], "isController": false}, {"data": ["deleteAccount", 17, 1, 5.882352941176471, 512.5882352941178, 98, 1375, 384.0, 1063.7999999999997, 1375.0, 1375.0, 0.0874530582848912, 0.0174273126832656, 0.05908908958794177], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=824643f8-8fbe-43e0-a6bc-f17529ac2af1", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1150.6249999999998, 763, 2495, 1137.0, 1442.5, 2250.75, 2495.0, 0.10447910635537698, 0.054076099969091594, 0.0480563077083814], "isController": false}, {"data": ["goToProfile", 17, 1, 5.882352941176471, 306.05882352941177, 112, 1517, 206.0, 611.3999999999992, 1517.0, 1517.0, 0.088162384740647, 0.15160000142615623, 0.05655499485287254], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 99.0, 97, 103, 98.0, 103.0, 103.0, 103.0, 0.02756202834478995, 0.013700266042478598, 0.013834846259005893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43e408a5-4b7c-4470-b194-f1b6da378763", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5d5468a-319d-48f6-8b0c-20c2ab60af90", 3, 0, 0.0, 288.0, 189, 400, 275.0, 400.0, 400.0, 400.0, 0.08171492386892926, 0.036973875057881404, 0.05240182292375997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa889c0-2d0c-4022-b05d-d1176b4c790b", 3, 0, 0.0, 318.66666666666663, 175, 585, 196.0, 585.0, 585.0, 585.0, 0.029889706981239227, 0.029977274482160827, 0.019167552979505623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ade71850-5a86-47cf-b316-9331055e967e", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc12aab0-1c63-4577-828e-655439574584", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 623.9836065573771, 397, 1232, 592.0, 798.8000000000001, 832.1999999999999, 1232.0, 0.2802754970295392, 0.9629040949513653, 0.5472201394600331], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3dd20faa-b406-4d3a-8322-98354a9d3dd4", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55280f06-9378-4bf6-9a87-b5ee6ddd4561", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d456317d-fb8e-4410-beac-8b791e1e09d1", 3, 0, 0.0, 482.6666666666667, 202, 890, 356.0, 890.0, 890.0, 890.0, 0.04553803184626361, 0.03796318344996129, 0.02920244880766253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5d5468a-319d-48f6-8b0c-20c2ab60af90", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a83984b-d95a-4da6-a57c-7b4a59d8864c", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 112.57894736842105, 99, 293, 102.0, 117.0, 293.0, 293.0, 0.11811586544737938, 0.08824085651098167, 0.04198649904574814], "isController": false}, {"data": ["deleteBooks", 17, 1, 5.882352941176471, 419.4117647058824, 100, 1023, 406.0, 661.3999999999996, 1023.0, 1023.0, 0.08717993425607311, 0.016336221596008185, 0.059740891299442565], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, 4.4692737430167595, 166.95530726256985, 97, 932, 103.0, 318.0, 398.0, 651.199999999996, 0.7148305372410736, 1.5820328879453216, 0.34366042779013534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 117.9, 97, 287, 99.0, 268.4000000000001, 287.0, 287.0, 0.05609720523723508, 0.043442464602663496, 0.019940803424173408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 140.35714285714283, 96, 295, 99.0, 293.0, 295.0, 295.0, 0.06415485148151882, 0.031889472074309644, 0.03220272818505925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a83984b-d95a-4da6-a57c-7b4a59d8864c", 3, 0, 0.0, 277.0, 185, 378, 268.0, 378.0, 378.0, 378.0, 0.034626438439963526, 0.028866636993732615, 0.02220510537979432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 114.11764705882354, 99, 289, 101.0, 155.39999999999986, 289.0, 289.0, 0.09379931360972864, 0.07612034141570752, 0.03334272475970823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b4d967e-6ab6-4bfc-87e7-ccbc727ea825", 3, 0, 0.0, 476.0, 193, 811, 424.0, 811.0, 811.0, 811.0, 0.08600917431192662, 0.03891691155389908, 0.05515562284977064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 491.4583333333333, 124, 968, 467.0, 854.5, 941.75, 968.0, 0.10410115161898978, 0.0639449456722115, 0.04706917304647683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55280f06-9378-4bf6-9a87-b5ee6ddd4561", 3, 0, 0.0, 613.6666666666667, 175, 1375, 291.0, 1375.0, 1375.0, 1375.0, 0.02865192684208013, 0.028735868034000286, 0.018373794231412062], "isController": false}, {"data": ["login", 24, 5, 20.833333333333332, 1913.7083333333333, 1072, 2870, 1891.5, 2572.5, 2847.25, 2870.0, 0.10559290415684067, 0.1571433462171342, 0.15854403334095948], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 101.3, 96, 116, 99.0, 114.9, 116.0, 116.0, 0.05520500378154276, 0.02744076848125514, 0.027710324163782205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d456317d-fb8e-4410-beac-8b791e1e09d1", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bb0dba6-85b5-4d75-8205-f2c7c3a1a5be", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1aa889c0-2d0c-4022-b05d-d1176b4c790b", 1, 0, 0.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 0.17660221163245357, 0.6739522238514175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 113.94117647058823, 97, 288, 101.0, 158.3999999999999, 288.0, 288.0, 0.07392975803225077, 0.059851337313218636, 0.02627971867552664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 143.4705882352941, 96, 292, 99.0, 291.2, 292.0, 292.0, 0.11315078340277686, 0.05624389526563811, 0.05679638932522198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c6e38db-46d2-4e40-9ee1-e42b4fc0efe5", 3, 0, 0.0, 317.3333333333333, 206, 538, 208.0, 538.0, 538.0, 538.0, 0.024031336863269706, 0.024258195186523227, 0.015410720579635846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ade71850-5a86-47cf-b316-9331055e967e", 3, 0, 0.0, 362.66666666666663, 220, 647, 221.0, 647.0, 647.0, 647.0, 0.05605381165919283, 0.03669408048393124, 0.03594596646113602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b4d967e-6ab6-4bfc-87e7-ccbc727ea825", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c6e38db-46d2-4e40-9ee1-e42b4fc0efe5", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b510fba-632d-4fa0-98f4-1ebf8caf2481", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 100.64285714285715, 97, 114, 100.0, 109.0, 114.0, 114.0, 0.06457028475495577, 0.05353532398140375, 0.022952718408988184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7d2c1ec-7dfa-42d8-b900-78974377675f", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 98.57894736842105, 97, 100, 99.0, 100.0, 100.0, 100.0, 0.09939161867097714, 0.04940462295266343, 0.04988993359070531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/824643f8-8fbe-43e0-a6bc-f17529ac2af1", 3, 0, 0.0, 307.6666666666667, 213, 384, 326.0, 384.0, 384.0, 384.0, 0.021889501794939148, 0.025872650070776056, 0.014037213065113971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e926206c-8d81-4f49-be26-6d4f4fbef558", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 112.21052631578947, 97, 298, 101.0, 112.0, 298.0, 298.0, 0.09820491748202591, 0.07624307558419004, 0.0349087792611889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd80f50c-5a87-4b71-b340-313b1a8795d6", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 121.88235294117646, 96, 296, 99.0, 293.6, 296.0, 296.0, 0.09227896473857912, 0.04586913383978201, 0.0463197147222946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 101.42857142857143, 98, 112, 99.0, 112.0, 112.0, 112.0, 0.08566673193655767, 0.042582389214558446, 0.048522172385940865], "isController": false}, {"data": ["register", 27, 5, 18.51851851851852, 877.7037037037038, 279, 1922, 839.0, 1378.9999999999998, 1795.9999999999993, 1922.0, 0.10782015597982565, 0.03425536205609044, 0.0486454219362104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7d2c1ec-7dfa-42d8-b900-78974377675f", 3, 0, 0.0, 943.3333333333334, 327, 1517, 986.0, 1517.0, 1517.0, 1517.0, 0.0835142809420411, 0.036972468125382775, 0.053555707505150055], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5380710659898478, 0.7824726134585289], "isController": false}, {"data": ["401/Unauthorized", 10, 5.0761421319796955, 1.5649452269170578], "isController": false}, {"data": ["404/Not Found", 182, 92.38578680203045, 28.482003129890455], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 639, 197, "404/Not Found", 182, "401/Unauthorized", 10, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
