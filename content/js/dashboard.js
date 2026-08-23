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

    var data = {"OkPercent": 97.68137621540762, "KoPercent": 2.318623784592371};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7660256410256411, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c35158fe-1a41-4cc7-af4f-c3393ea8e9a0"], "isController": false}, {"data": [0.211864406779661, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c142cfcf-f45d-4ec2-a6a2-aa0156eb263e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bad512e4-7c55-420e-b638-f59c33eaf44e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f98e268e-827a-4f10-99da-3a84266319a3"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfb56cfd-decd-4911-9633-ff21b36e8d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c65d468-62b3-4624-bfe5-2e95dc9bce2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66f41583-81e2-4659-9aad-fff430c3612e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a1828b4-ca3f-4b50-a70b-657512cb4a49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67e6a906-2e7a-4ff8-9083-01b6572c478c"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66f41583-81e2-4659-9aad-fff430c3612e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbcf4321-0a29-437c-b2a4-6c64c3ea0611"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aade4c52-0cdb-4d61-9074-091b7a22f819"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/188bd9f9-c90d-495d-9433-ed95c8248cdc"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f458d207-9fdb-4452-8a73-d5eff4f8e7cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc48340d-a6f1-4b8d-af41-2bf1f7173759"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfb56cfd-decd-4911-9633-ff21b36e8d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/161b870d-301c-413e-afe9-132ef5d97ccd"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bad512e4-7c55-420e-b638-f59c33eaf44e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c35158fe-1a41-4cc7-af4f-c3393ea8e9a0"], "isController": false}, {"data": [0.4491525423728814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f98e268e-827a-4f10-99da-3a84266319a3"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c142cfcf-f45d-4ec2-a6a2-aa0156eb263e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6186440677966102, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c65d468-62b3-4624-bfe5-2e95dc9bce2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.878698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1175a74a-6b12-4a7c-a4da-8aee5b3a8592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1175a74a-6b12-4a7c-a4da-8aee5b3a8592"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbcf4321-0a29-437c-b2a4-6c64c3ea0611"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aade4c52-0cdb-4d61-9074-091b7a22f819"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=188bd9f9-c90d-495d-9433-ed95c8248cdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc48340d-a6f1-4b8d-af41-2bf1f7173759"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f458d207-9fdb-4452-8a73-d5eff4f8e7cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1337, 31, 2.318623784592371, 368.3732236350041, 89, 3055, 113.0, 995.2, 1228.5999999999995, 1675.4399999999987, 5.212069234367691, 768.2220235325219, 3.8106190550444414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c35158fe-1a41-4cc7-af4f-c3393ea8e9a0", 3, 0, 0.0, 859.3333333333334, 216, 1243, 1119.0, 1243.0, 1243.0, 1243.0, 0.05218571155217701, 0.033550384217301304, 0.03346544653573851], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1609.2372881355923, 1146, 2208, 1576.0, 2004.0, 2154.0, 2208.0, 0.255609324974764, 307.58335784953493, 1.256829053953063], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c142cfcf-f45d-4ec2-a6a2-aa0156eb263e", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bad512e4-7c55-420e-b638-f59c33eaf44e", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f98e268e-827a-4f10-99da-3a84266319a3", 1, 0, 0.0, 1829.0, 1829, 1829, 1829.0, 1829.0, 1829.0, 1829.0, 0.5467468562055768, 0.09877750820120285, 0.3769563285948606], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 781.9999999999999, 104, 2068, 763.0, 1672.0000000000002, 2068.0, 2068.0, 0.09647543092359145, 0.01889938617507075, 0.06495761110753795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 781.9999999999999, 104, 2068, 763.0, 1672.0000000000002, 2068.0, 2068.0, 0.09526712902979956, 0.018662681722048626, 0.06414405263191322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfb56cfd-decd-4911-9633-ff21b36e8d63", 3, 0, 0.0, 377.0, 207, 528, 396.0, 528.0, 528.0, 528.0, 0.045358330813426065, 0.02874761396280617, 0.029087210840641062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 146.24999999999997, 92, 298, 99.0, 293.6, 297.8, 298.0, 0.09515381614379644, 0.03260690828599431, 0.05386783908062383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 118.8, 94, 296, 99.0, 273.50000000000034, 295.75, 296.0, 0.09523265337218827, 0.07077348556272975, 0.047802327962211684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 172.45000000000002, 91, 776, 98.0, 307.6, 752.5999999999997, 776.0, 0.0952421770456829, 1.4246053253472768, 0.05567574919877518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 175.1, 91, 878, 99.5, 303.3, 849.2999999999996, 878.0, 0.09515109994671539, 4.305220234654506, 0.05552958723452843], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 318.20000000000005, 103, 1105, 265.0, 728.2000000000003, 1105.0, 1105.0, 0.0964289158175565, 0.1541293172029186, 0.06232723152582687], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 98.56249999999999, 91, 103, 99.0, 102.3, 103.0, 103.0, 0.0800444246556839, 0.05948613980759321, 0.040178549094747586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 120.93749999999999, 92, 291, 99.5, 278.40000000000003, 291.0, 291.0, 0.08004482510205715, 0.02893221766689346, 0.045230407153005685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 725.125, 485, 822, 766.0, 822.0, 822.0, 822.0, 0.05156167420756152, 15.16084422573701, 0.02940626732149993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 931.0, 674, 1136, 955.5, 1136.0, 1136.0, 1136.0, 0.05143206146131345, 46.27865931081038, 0.029282120929634513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 191.125, 96, 291, 189.5, 291.0, 291.0, 291.0, 0.05176820784935452, 0.09160546154592811, 0.02866462290096095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 117.3, 93, 287, 98.0, 268.70000000000005, 287.0, 287.0, 0.05545419760548775, 0.04121156677517204, 0.02783540778244209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 134.5, 92, 294, 96.0, 293.1, 294.0, 294.0, 0.05539429660322173, 0.03146222939886109, 0.030661608705767653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c65d468-62b3-4624-bfe5-2e95dc9bce2d", 3, 0, 0.0, 336.3333333333333, 235, 469, 305.0, 469.0, 469.0, 469.0, 0.08422944099727657, 0.03904385546227925, 0.05401432251452958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66f41583-81e2-4659-9aad-fff430c3612e", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 317.90000000000003, 92, 1081, 101.5, 1063.9, 1081.0, 1081.0, 0.055453275070425655, 9.991347989402879, 0.03164735737417652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 280.6, 91, 779, 98.5, 778.6, 779.0, 779.0, 0.0553939897521119, 3.2694787771776763, 0.03166761875086553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 96.87499999999999, 89, 107, 97.0, 107.0, 107.0, 107.0, 0.05177055290950507, 0.03847401441809899, 0.029070378831020916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 773.5625000000002, 93, 1308, 893.0, 1305.2, 1308.0, 1308.0, 0.10195498687329543, 57.34735277460939, 0.05446228302704356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 180.81249999999997, 90, 872, 100.5, 470.2000000000004, 872.0, 872.0, 0.08004402421331733, 4.5217105736279954, 0.04662720746410526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 577.6875000000001, 94, 980, 776.0, 933.8000000000001, 980.0, 980.0, 0.10207206287639073, 18.76817660221241, 0.05462450239869347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 142.0625, 90, 808, 97.5, 315.9000000000005, 808.0, 808.0, 0.08004362377495736, 1.4911935598651265, 0.046705141802282246], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 547.3333333333334, 106, 1829, 466.0, 1605.8000000000002, 1829.0, 1829.0, 0.09558036397002599, 0.01872404395740939, 0.0649896693556609], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a1828b4-ca3f-4b50-a70b-657512cb4a49", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.8870442708333334, 1.6574435763888888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67e6a906-2e7a-4ff8-9083-01b6572c478c", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 464.0, 186, 1179, 296.0, 1162.6000000000001, 1179.0, 1179.0, 0.05536332179930795, 13.315397923875432, 0.12168036332179931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 639.4166666666666, 146, 1599, 629.0, 1119.0, 1510.5, 1599.0, 0.1001268273145985, 0.06150368591883052, 0.045272188522128026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 110.125, 91, 290, 98.5, 161.20000000000013, 290.0, 290.0, 0.10206359837974037, 0.07584999840525629, 0.05123114215545562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66f41583-81e2-4659-9aad-fff430c3612e", 3, 0, 0.0, 334.0, 226, 446, 330.0, 446.0, 446.0, 446.0, 0.06967670011148272, 0.03275167804719435, 0.04468199844388703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 148.74999999999997, 90, 313, 100.0, 308.1, 313.0, 313.0, 0.10207076055475459, 0.12312783884302794, 0.0528545124845299], "isController": false}, {"data": ["login", 24, 0, 0.0, 2785.5416666666665, 1609, 3786, 2888.5, 3642.5, 3773.0, 3786.0, 0.10522300701048284, 42.10259544603594, 0.21691969511633719], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.37499999999999, 93, 271, 107.0, 165.30000000000013, 271.0, 271.0, 0.07886629698089956, 0.06384781269254466, 0.028034504004929142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbcf4321-0a29-437c-b2a4-6c64c3ea0611", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 886.8124999999999, 197, 1412, 998.5, 1405.7, 1412.0, 1412.0, 0.10188487009679062, 76.24029158574248, 0.21284883628374937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aade4c52-0cdb-4d61-9074-091b7a22f819", 3, 0, 0.0, 744.3333333333334, 360, 1105, 768.0, 1105.0, 1105.0, 1105.0, 0.023725730554786665, 0.023795239531021393, 0.01521474257582348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/188bd9f9-c90d-495d-9433-ed95c8248cdc", 3, 0, 0.0, 469.33333333333337, 308, 791, 309.0, 791.0, 791.0, 791.0, 0.018767242403958637, 0.025872158717696884, 0.012034982921809411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 338.4, 192, 978, 214.5, 594.8000000000001, 958.9499999999997, 978.0, 0.09509771290000475, 5.828510034294613, 0.21266040309543055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 730.3333333333333, 101, 1228, 936.0, 1224.1, 1228.0, 1228.0, 0.07709951620053583, 61.49876038434109, 0.1329289021992637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f458d207-9fdb-4452-8a73-d5eff4f8e7cf", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc48340d-a6f1-4b8d-af41-2bf1f7173759", 3, 0, 0.0, 404.0, 275, 477, 460.0, 477.0, 477.0, 477.0, 0.170328734457503, 0.0770693166978936, 0.10922773661500029], "isController": false}, {"data": ["register", 25, 8, 32.0, 1069.04, 171, 2037, 1044.0, 1771.6000000000006, 2004.0, 2037.0, 0.1045876318850038, 0.03273266041650979, 0.04718699797936696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfb56cfd-decd-4911-9633-ff21b36e8d63", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 0.22956043519695044, 0.8760522554002541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/161b870d-301c-413e-afe9-132ef5d97ccd", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 293.9375, 195, 973, 202.0, 569.1000000000004, 973.0, 973.0, 0.08000520033802197, 6.098370026864246, 0.17865419064739207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 103.4375, 94, 118, 104.0, 111.7, 118.0, 118.0, 0.12118549712563148, 0.09408444356921586, 0.04307765718137682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 303.0, 189, 589, 207.5, 488.00000000000017, 584.3, 589.0, 0.11076895810718004, 0.17167025050399876, 0.24912198293050353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bad512e4-7c55-420e-b638-f59c33eaf44e", 3, 0, 0.0, 896.3333333333334, 334, 1444, 911.0, 1444.0, 1444.0, 1444.0, 0.04994589195038708, 0.03211039602930159, 0.03202910388745526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 142.44444444444446, 94, 314, 99.0, 314.0, 314.0, 314.0, 0.04462891060829205, 0.03316660251260767, 0.022401621145177845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 140.88888888888889, 95, 298, 98.0, 298.0, 298.0, 298.0, 0.044585577061216, 0.019370730311752262, 0.02501165727066913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 210.33333333333337, 91, 935, 98.0, 935.0, 935.0, 935.0, 0.04462935322149548, 4.472644724624494, 0.025811030020678267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 189.77777777777777, 92, 748, 100.0, 748.0, 748.0, 748.0, 0.044629574531389465, 1.4687565859615195, 0.02585474158236636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 108.5, 106, 111, 108.5, 111.0, 111.0, 111.0, 0.07490917262818833, 0.022092353646203978, 0.04630615847035469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c35158fe-1a41-4cc7-af4f-c3393ea8e9a0", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1092.7627118644066, 741, 1794, 1003.0, 1585.0, 1613.0, 1794.0, 0.2598157509996301, 310.8299647652411, 0.5130346176965352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f98e268e-827a-4f10-99da-3a84266319a3", 3, 0, 0.0, 773.6666666666666, 394, 973, 954.0, 973.0, 973.0, 973.0, 0.022704568159113613, 0.026836030919837738, 0.014559895596827414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1069.04, 171, 2037, 1044.0, 1771.6000000000006, 2004.0, 2037.0, 0.10374778498479056, 0.032469814581958675, 0.04680808267868481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 122.28571428571428, 91, 282, 96.0, 282.0, 282.0, 282.0, 0.03455203289353531, 0.009312852615835691, 0.02034655843242363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c142cfcf-f45d-4ec2-a6a2-aa0156eb263e", 3, 0, 0.0, 344.0, 265, 461, 306.0, 461.0, 461.0, 461.0, 0.025590064231061218, 0.030246589590814874, 0.01641029509609069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 125.71428571428572, 92, 296, 97.0, 296.0, 296.0, 296.0, 0.03458446762152735, 0.009321594788614794, 0.020331884285311977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 146.43750000000003, 91, 304, 99.5, 301.9, 304.0, 304.0, 0.12090436464756378, 0.03258750453391367, 0.07107854249788417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 120.75, 92, 286, 97.5, 277.6, 286.0, 286.0, 0.12090436464756378, 0.03258750453391367, 0.0711966131664853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 96.14285714285714, 93, 102, 95.0, 102.0, 102.0, 102.0, 0.03458361329591716, 0.009253818401446583, 0.019723466957827757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 99.18749999999999, 91, 113, 97.5, 108.10000000000001, 113.0, 113.0, 0.12090619190835311, 0.08985313676001631, 0.06068924086024755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 99.85714285714286, 95, 108, 99.0, 108.0, 108.0, 108.0, 0.034583955021096215, 0.025701552510795134, 0.017359524297698683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 159.1875, 90, 309, 100.5, 303.4, 309.0, 309.0, 0.12090801922437505, 0.03235234108152223, 0.0689553547139014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 102.85714285714285, 97, 118, 101.0, 118.0, 118.0, 118.0, 0.03433291152899169, 0.027023756535514944, 0.012204277145071265], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 618.4666666666667, 101, 1119, 584.0, 1031.4, 1119.0, 1119.0, 0.09421696282198647, 0.018113456459200917, 0.064117832837124], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1470.125, 782, 3055, 1373.5, 2225.0, 2912.75, 3055.0, 0.10351118567750227, 0.05357512539948848, 0.04761110200596052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 253.57142857142856, 190, 404, 200.0, 404.0, 404.0, 404.0, 0.034535667944486384, 0.05352354006630848, 0.07767152663686733], "isController": false}, {"data": ["addBook", 55, 15, 27.272727272727273, 1133.709090909091, 487, 2862, 817.0, 2079.9999999999995, 2731.7999999999993, 2862.0, 0.25066654513137204, 82.81139176190096, 0.908541604949525], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 154.38983050847455, 91, 419, 103.0, 394.0, 407.0, 419.0, 0.26056963171353237, 0.1936459860683576, 0.125958952830272], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 608.9661016949153, 458, 967, 578.0, 811.0, 892.0, 967.0, 0.26051325526766633, 76.59954690287272, 0.13101985006137515], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 141.77966101694915, 90, 305, 102.0, 291.0, 295.0, 305.0, 0.26073660299979673, 0.461381567026984, 0.12680354325576051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c65d468-62b3-4624-bfe5-2e95dc9bce2d", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 928.8983050847454, 628, 1398, 902.0, 1198.0, 1311.0, 1398.0, 0.2603155553986799, 234.2323943336694, 0.130666206518478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 113.39999999999999, 96, 297, 105.0, 109.9, 287.64999999999986, 297.0, 0.11329198175999095, 0.08463707621718074, 0.04027175914124678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, 8.875739644970414, 199.9704142011835, 92, 2199, 107.0, 302.0, 505.5, 1970.8000000000038, 0.7027027027027027, 1.637685161122661, 0.33211652156964655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 103.22222222222221, 98, 112, 101.0, 112.0, 112.0, 112.0, 0.04514582100183593, 0.03496155864692958, 0.016047928559246364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1175a74a-6b12-4a7c-a4da-8aee5b3a8592", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 125.35, 95, 306, 104.0, 277.7000000000004, 305.45, 306.0, 0.09905550575264849, 0.08038586453169033, 0.035211136810511766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1175a74a-6b12-4a7c-a4da-8aee5b3a8592", 3, 0, 0.0, 482.66666666666663, 223, 887, 338.0, 887.0, 887.0, 887.0, 0.03299458888742247, 0.02750623116558884, 0.021158639358145263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbcf4321-0a29-437c-b2a4-6c64c3ea0611", 3, 0, 0.0, 399.6666666666667, 285, 584, 330.0, 584.0, 584.0, 584.0, 0.05377693328075144, 0.03457338646793102, 0.03448585890725271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 379.11111111111114, 194, 1221, 200.0, 1221.0, 1221.0, 1221.0, 0.04456305920449988, 5.9850470821099115, 0.09895648943360351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aade4c52-0cdb-4d61-9074-091b7a22f819", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 274.0625, 195, 408, 209.5, 406.6, 408.0, 408.0, 0.12081580874857475, 0.18724090672264468, 0.2717175854960622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=188bd9f9-c90d-495d-9433-ed95c8248cdc", 1, 0, 0.0, 1457.0, 1457, 1457, 1457.0, 1457.0, 1457.0, 1457.0, 0.6863417982155113, 0.12399729752916952, 0.4732004975978037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 142.3, 95, 315, 102.5, 311.20000000000005, 315.0, 315.0, 0.054775911745051, 0.045414794015183876, 0.019471124878123594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 107.43750000000001, 95, 157, 103.0, 127.60000000000002, 157.0, 157.0, 0.09782761551301412, 0.07595015071567016, 0.034774660201891745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc48340d-a6f1-4b8d-af41-2bf1f7173759", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 109.44999999999999, 91, 276, 101.5, 106.9, 267.54999999999984, 276.0, 0.11094407863716295, 0.08244965219031349, 0.05568872697216968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 135.3, 90, 306, 100.0, 290.8, 305.3, 306.0, 0.11093977079843353, 0.0296850558581746, 0.06327033803348163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f458d207-9fdb-4452-8a73-d5eff4f8e7cf", 3, 0, 0.0, 422.0, 198, 676, 392.0, 676.0, 676.0, 676.0, 0.08060615831049492, 0.036472187516792945, 0.05169079813531086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 162.65, 93, 391, 99.5, 318.3, 387.4, 391.0, 0.1108272701580951, 0.02987141265979907, 0.06515431312028637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 143.75, 90, 301, 100.0, 291.0, 300.55, 301.0, 0.11093915542020978, 0.029901569234353418, 0.06532842843592432], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.5983545250560958], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.14958863126402394], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14958863126402394], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4210919970082274], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1337, 31, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
