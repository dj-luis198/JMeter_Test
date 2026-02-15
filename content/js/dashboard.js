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

    var data = {"OkPercent": 69.09385113268608, "KoPercent": 30.906148867313917};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5280764635603346, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d73c234c-5985-4d79-b0ef-1f9d9ce0801a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c111b48c-ab6d-48dc-b239-5429542e48de"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95eaac60-5e15-4582-bd25-9916800e7202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e764b8fe-261c-49a7-9234-0395dd74432c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4761ee9a-8df6-4543-982e-2e6336624e5c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4761ee9a-8df6-4543-982e-2e6336624e5c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e86f8415-01b1-48e8-96bc-6238a395ed14"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95eaac60-5e15-4582-bd25-9916800e7202"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c111b48c-ab6d-48dc-b239-5429542e48de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57bcc0d3-538e-4dec-a2c7-33cbc288ca81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9c197be-dd9e-4482-8f26-19aa50c527e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/744701a7-1cb3-4f15-8b72-ebb6ee4d3359"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cb02f50-0035-4b4f-9a48-3fc5ae094926"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=744701a7-1cb3-4f15-8b72-ebb6ee4d3359"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/681daccf-904e-4b24-a70e-d7cda744de53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32f8a4cb-9895-4b2d-87d3-c54077a02426"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e764b8fe-261c-49a7-9234-0395dd74432c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9664804469273743, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=681daccf-904e-4b24-a70e-d7cda744de53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/32f8a4cb-9895-4b2d-87d3-c54077a02426"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c014204a-4b48-4015-beb9-34e46525cb50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/859f35a3-6517-4826-8b0a-33fca298b420"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8cb02f50-0035-4b4f-9a48-3fc5ae094926"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e86f8415-01b1-48e8-96bc-6238a395ed14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d83b9650-3c52-4f5c-aa35-ec3891262329"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c014204a-4b48-4015-beb9-34e46525cb50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d83b9650-3c52-4f5c-aa35-ec3891262329"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d73c234c-5985-4d79-b0ef-1f9d9ce0801a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/77d0e578-e5ee-4a47-8ea5-907ecf7df5ee"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bd55860-719a-4517-b131-6a35e101667e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e28fd51d-ecaa-4876-bee9-19396e450b91"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c62b63c4-7c50-48b2-b1de-364f58bec52e"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bd55860-719a-4517-b131-6a35e101667e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 618, 191, 30.906148867313917, 255.37540453074413, 98, 2203, 106.0, 620.4000000000001, 934.2999999999988, 1505.2099999999978, 2.4443688544690816, 2.5330075081281196, 1.1708274663207108], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d73c234c-5985-4d79-b0ef-1f9d9ce0801a", 3, 0, 0.0, 367.3333333333333, 250, 544, 308.0, 544.0, 544.0, 544.0, 0.05934718100890208, 0.03815451904055391, 0.0380579253214639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c111b48c-ab6d-48dc-b239-5429542e48de", 3, 0, 0.0, 257.6666666666667, 197, 368, 208.0, 368.0, 368.0, 368.0, 0.08613017139904108, 0.040485666503976336, 0.05523321538284861], "isController": false}, {"data": ["see books", 59, 59, 100.0, 552.3898305084747, 401, 736, 604.0, 718.0, 728.0, 736.0, 0.27441349928373426, 1.7644838875090696, 0.46066094264525315], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, 100.0, 101.6153846153846, 99, 104, 102.0, 103.6, 104.0, 104.0, 0.11603931054797333, 0.05767969635636565, 0.05824629455240067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 124.73684210526314, 101, 303, 103.0, 298.0, 303.0, 303.0, 0.11491402616410933, 0.08921547929733097, 0.040848345238023234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 102.375, 99, 114, 101.0, 107.7, 114.0, 114.0, 0.1155927378862423, 0.05745771834384505, 0.05802213600930521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95eaac60-5e15-4582-bd25-9916800e7202", 1, 0, 0.0, 1513.0, 1513, 1513, 1513.0, 1513.0, 1513.0, 1513.0, 0.6609385327164573, 0.11940784038334436, 0.4556861368142763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e764b8fe-261c-49a7-9234-0395dd74432c", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4761ee9a-8df6-4543-982e-2e6336624e5c", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4761ee9a-8df6-4543-982e-2e6336624e5c", 3, 0, 0.0, 461.0, 200, 793, 390.0, 793.0, 793.0, 793.0, 0.019353465237950854, 0.02287514071582017, 0.012410913580326558], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 191.4237288135593, 99, 417, 104.0, 404.0, 413.0, 417.0, 0.26148657332925596, 0.12997721271932738, 0.12640220097459148], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 461.07142857142856, 104, 861, 418.5, 777.0, 861.0, 861.0, 0.08106355382619974, 0.015306852693047062, 0.05482081154750324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 461.07142857142856, 104, 861, 418.5, 777.0, 861.0, 861.0, 0.08208832703989492, 0.015500355838239088, 0.05551383444836644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e86f8415-01b1-48e8-96bc-6238a395ed14", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 853.9565217391306, 118, 1472, 853.0, 1144.4, 1406.799999999999, 1472.0, 0.09097165639609851, 0.029077557292367082, 0.04104385278808351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95eaac60-5e15-4582-bd25-9916800e7202", 3, 0, 0.0, 390.66666666666663, 203, 675, 294.0, 675.0, 675.0, 675.0, 0.08203221131497634, 0.038078754340871185, 0.05260529176123158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c111b48c-ab6d-48dc-b239-5429542e48de", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57bcc0d3-538e-4dec-a2c7-33cbc288ca81", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9c197be-dd9e-4482-8f26-19aa50c527e6", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 130.5, 101, 301, 106.5, 301.0, 301.0, 301.0, 0.04612758891092763, 0.03630745767793718, 0.016396916370681306], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 482.8571428571427, 293, 722, 402.0, 698.5, 722.0, 722.0, 0.08047318231199452, 0.01635734188456697, 0.05428684055101137], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1174.0952380952383, 725, 2203, 1103.0, 1830.6000000000001, 2169.4999999999995, 2203.0, 0.09246254166318098, 0.04785658894676359, 0.04252915734702953], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 259.1428571428571, 103, 793, 197.0, 554.0, 793.0, 793.0, 0.08122769864523803, 0.17046144766615418, 0.05201949646079313], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 103.0, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.046242507268744105, 0.022985777538858155, 0.02321157103138132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/744701a7-1cb3-4f15-8b72-ebb6ee4d3359", 3, 0, 0.0, 364.3333333333333, 195, 620, 278.0, 620.0, 620.0, 620.0, 0.0169741822687692, 0.02340028056908775, 0.010885136415844833], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 641.95, 413, 1936, 591.5, 770.7, 813.75, 1936.0, 0.29298305581327216, 0.9050477394526101, 0.5738633935983203], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cb02f50-0035-4b4f-9a48-3fc5ae094926", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=744701a7-1cb3-4f15-8b72-ebb6ee4d3359", 1, 0, 0.0, 1099.0, 1099, 1099, 1099.0, 1099.0, 1099.0, 1099.0, 0.9099181073703367, 0.16438950181983622, 0.6273458826205641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/681daccf-904e-4b24-a70e-d7cda744de53", 3, 0, 0.0, 339.6666666666667, 188, 569, 262.0, 569.0, 569.0, 569.0, 0.0608815650620992, 0.027547322733176394, 0.0390418890534946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 118.18749999999999, 100, 308, 104.0, 175.70000000000013, 308.0, 308.0, 0.12110019527406488, 0.09047036072720667, 0.043047335038827746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32f8a4cb-9895-4b2d-87d3-c54077a02426", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e764b8fe-261c-49a7-9234-0395dd74432c", 3, 0, 0.0, 283.6666666666667, 179, 382, 290.0, 382.0, 382.0, 382.0, 0.021941051707745192, 0.025933580322533463, 0.014070270789146494], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 549.0000000000001, 105, 1513, 459.0, 1306.0, 1513.0, 1513.0, 0.08233163181294254, 0.015546297943473453, 0.05634456192220837], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 4, 2.2346368715083798, 174.03351955307255, 100, 1629, 108.0, 300.0, 326.0, 1498.599999999998, 0.7833115260571424, 1.6742634300730361, 0.3763908976137443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 103.14285714285714, 100, 107, 102.5, 106.5, 107.0, 107.0, 0.06981986474894772, 0.054069485103433144, 0.02481878004747751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 138.41666666666666, 99, 333, 102.0, 323.70000000000005, 333.0, 333.0, 0.07824573071731775, 0.038893629819447974, 0.03927568905146613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=681daccf-904e-4b24-a70e-d7cda744de53", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 105.58823529411767, 100, 121, 105.0, 113.8, 121.0, 121.0, 0.08188982446675273, 0.06645551184753078, 0.029109273540916008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 468.14285714285705, 122, 788, 473.0, 708.6, 781.3, 788.0, 0.09173229894245764, 0.056347281283990094, 0.04147661563511513], "isController": false}, {"data": ["login", 21, 2, 9.523809523809524, 2025.9047619047624, 1496, 3127, 1896.0, 2998.6000000000004, 3125.4, 3127.0, 0.0913766545701381, 0.13414997139040458, 0.1375621483630525], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/32f8a4cb-9895-4b2d-87d3-c54077a02426", 3, 0, 0.0, 702.0, 315, 1122, 669.0, 1122.0, 1122.0, 1122.0, 0.027363524421945548, 0.03234275949742327, 0.017547572627354402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, 100.0, 144.5, 99, 306, 102.0, 303.5, 306.0, 306.0, 0.0671404866726134, 0.033373542691758025, 0.033701377099339146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c014204a-4b48-4015-beb9-34e46525cb50", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/859f35a3-6517-4826-8b0a-33fca298b420", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 118.92307692307692, 101, 303, 103.0, 226.99999999999994, 303.0, 303.0, 0.13113695742083867, 0.10616458759948756, 0.046615090333188745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cb02f50-0035-4b4f-9a48-3fc5ae094926", 3, 0, 0.0, 253.33333333333334, 194, 371, 195.0, 371.0, 371.0, 371.0, 0.03992015968063872, 0.025300960578842315, 0.025599841982701262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, 100.0, 147.21052631578948, 99, 379, 102.0, 302.0, 379.0, 379.0, 0.1105190907187231, 0.05493575896077154, 0.05547540295842156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e86f8415-01b1-48e8-96bc-6238a395ed14", 3, 0, 0.0, 291.3333333333333, 197, 408, 269.0, 408.0, 408.0, 408.0, 0.0747887218607434, 0.04808194195148705, 0.04796021551616683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d83b9650-3c52-4f5c-aa35-ec3891262329", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 154.08333333333331, 101, 311, 105.0, 307.7, 311.0, 311.0, 0.08024877119069115, 0.06653438158290702, 0.028525930384190993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 112.24999999999999, 99, 298, 102.0, 111.80000000000001, 288.6999999999999, 298.0, 0.100181830021489, 0.04979741355560342, 0.05028658264750522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c014204a-4b48-4015-beb9-34e46525cb50", 3, 0, 0.0, 281.0, 205, 353, 285.0, 353.0, 353.0, 353.0, 0.01783241100140876, 0.02458341816112178, 0.01143549794035653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 114.45000000000002, 100, 301, 103.5, 113.9, 291.64999999999986, 301.0, 0.10161104308816282, 0.07888747974129828, 0.03611955047274538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83b9650-3c52-4f5c-aa35-ec3891262329", 3, 0, 0.0, 584.6666666666666, 192, 840, 722.0, 840.0, 840.0, 840.0, 0.026776151374509106, 0.02685459713048911, 0.017170904364512674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d73c234c-5985-4d79-b0ef-1f9d9ce0801a", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77d0e578-e5ee-4a47-8ea5-907ecf7df5ee", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.48828125, 0.9123542622324159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 113.23529411764706, 98, 298, 101.0, 145.19999999999987, 298.0, 298.0, 0.08102684848455963, 0.040276040897110205, 0.04067167980572622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bd55860-719a-4517-b131-6a35e101667e", 3, 0, 0.0, 250.0, 171, 396, 183.0, 396.0, 396.0, 396.0, 0.02186620796221519, 0.025845117549089636, 0.014022275288269508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 198.5, 101, 297, 198.0, 297.0, 297.0, 297.0, 0.04052972348596152, 0.02014612231870548, 0.02310471297356449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e28fd51d-ecaa-4876-bee9-19396e450b91", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c62b63c4-7c50-48b2-b1de-364f58bec52e", 1, 0, 0.0, 1531.0, 1531, 1531, 1531.0, 1531.0, 1531.0, 1531.0, 0.6531678641410843, 0.20857997224036579, 0.38973199706074463], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 853.9565217391306, 118, 1472, 853.0, 1144.4, 1406.799999999999, 1472.0, 0.09252963965739895, 0.02957554039321074, 0.04174677101730304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bd55860-719a-4517-b131-6a35e101667e", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 1.5706806282722514, 0.4854368932038835], "isController": false}, {"data": ["401/Unauthorized", 6, 3.141361256544503, 0.970873786407767], "isController": false}, {"data": ["404/Not Found", 182, 95.28795811518324, 29.449838187702266], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 618, 191, "404/Not Found", 182, "401/Unauthorized", 6, "406/Not Acceptable", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
