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

    var data = {"OkPercent": 98.70024370430544, "KoPercent": 1.2997562956945572};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.721602787456446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b5024fc-bae5-42a4-8c99-8935f98d1d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb1e6206-b792-40c8-9bbd-21cc24129cd6"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c105bc41-a0ff-4459-b3d6-b19ca09bef24"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/847ee294-7d40-45cd-a5f1-dd44f1ceda2e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c9797d7-5e2b-4385-bf95-85e19cbb4e18"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=068fbb90-df50-4ce7-b8bc-ee9b2cd21c91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78c446f4-cb27-44b1-8a74-69485c305d0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d343693-9d8e-4d9c-9afc-74e95f995f04"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d79da37-8307-439f-ad1f-9c7c08a2830e"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5f56be9f-156e-4364-beb7-32d71e1ae72a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c6d8e51-6e91-4d03-8b19-fbedd2c1eee6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fa743b7-eb58-4a3e-be62-23f7ac2bb854"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c44ee0ac-ce61-4a11-b3aa-f8b94b341cb5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c3ecd6b-8adc-4a31-970f-904ecbb5d55d"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c105bc41-a0ff-4459-b3d6-b19ca09bef24"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da3efcd6-207a-4a8e-b4ba-841126a308f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c9797d7-5e2b-4385-bf95-85e19cbb4e18"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d343693-9d8e-4d9c-9afc-74e95f995f04"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/068fbb90-df50-4ce7-b8bc-ee9b2cd21c91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.12745098039215685, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=847ee294-7d40-45cd-a5f1-dd44f1ceda2e"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb1e6206-b792-40c8-9bbd-21cc24129cd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [0.9019607843137255, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9461077844311377, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3c6d8e51-6e91-4d03-8b19-fbedd2c1eee6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f56be9f-156e-4364-beb7-32d71e1ae72a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d79da37-8307-439f-ad1f-9c7c08a2830e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c44ee0ac-ce61-4a11-b3aa-f8b94b341cb5"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c3ecd6b-8adc-4a31-970f-904ecbb5d55d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b5024fc-bae5-42a4-8c99-8935f98d1d63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1231, 16, 1.2997562956945572, 518.7156783103168, 140, 3515, 172.0, 1478.9999999999995, 1761.7999999999997, 2191.240000000001, 4.941056527131659, 685.0831609779459, 3.607652836341049], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 2528.333333333334, 1806, 3238, 2485.0, 3077.8000000000006, 3185.2, 3238.0, 0.2240980055277508, 269.66559980957163, 1.1018881424142826], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 598.9230769230769, 156, 954, 572.0, 937.1999999999999, 954.0, 954.0, 0.08570788116931921, 0.01623762592465618, 0.05793909424900118], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 598.9230769230769, 156, 954, 572.0, 937.1999999999999, 954.0, 954.0, 0.08695128721347879, 0.0164731930853661, 0.05877964495448435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b5024fc-bae5-42a4-8c99-8935f98d1d63", 1, 0, 0.0, 1701.0, 1701, 1701, 1701.0, 1701.0, 1701.0, 1701.0, 0.5878894767783657, 0.10621050117577895, 0.4053222369194591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 250.66666666666669, 146, 457, 152.0, 455.8, 457.0, 457.0, 0.13357436084668334, 0.06249123418256944, 0.07468337310880968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 213.33333333333334, 142, 458, 153.0, 457.4, 458.0, 458.0, 0.13358030848145905, 0.09927208472108431, 0.06705105328073238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 381.3333333333333, 141, 1141, 423.0, 993.4000000000001, 1141.0, 1141.0, 0.1332196525631461, 5.253919433194785, 0.07692220693896763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb1e6206-b792-40c8-9bbd-21cc24129cd6", 3, 0, 0.0, 458.0, 389, 518, 467.0, 518.0, 518.0, 518.0, 0.04843944262348021, 0.030700388928358066, 0.031063054026125005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 399.59999999999997, 147, 1822, 153.0, 1532.2000000000003, 1822.0, 1822.0, 0.13323858589447504, 16.016232207097175, 0.07680302340557826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c105bc41-a0ff-4459-b3d6-b19ca09bef24", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/847ee294-7d40-45cd-a5f1-dd44f1ceda2e", 3, 0, 0.0, 449.66666666666663, 273, 790, 286.0, 790.0, 790.0, 790.0, 0.01647627416520211, 0.022713874052614234, 0.010565839878075571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c9797d7-5e2b-4385-bf95-85e19cbb4e18", 3, 0, 0.0, 427.66666666666663, 240, 796, 247.0, 796.0, 796.0, 796.0, 0.022480329711502437, 0.026570988666167104, 0.014416096852753841], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 379.15384615384613, 152, 1388, 275.0, 1040.3999999999996, 1388.0, 1388.0, 0.08561192771719088, 0.1963183372517254, 0.055340342398319364], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 193.95000000000002, 144, 459, 151.0, 449.80000000000007, 458.7, 459.0, 0.10625468184691889, 0.07896466102100123, 0.0533348695989417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 194.9, 143, 454, 151.0, 453.0, 453.95, 454.0, 0.10625806897211257, 0.02843233486167856, 0.06060030496065795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1165.2, 1056, 1205, 1191.0, 1205.0, 1205.0, 1205.0, 0.08629170046424935, 25.372625090606288, 0.04921323542101721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1568.0, 1300, 1801, 1582.0, 1801.0, 1801.0, 1801.0, 0.08589589417625838, 77.28927656867377, 0.04890361943824085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 335.2, 144, 466, 458.0, 466.0, 466.0, 466.0, 0.08736523911865947, 0.1545955207841904, 0.04837508845730461], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=068fbb90-df50-4ce7-b8bc-ee9b2cd21c91", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 151.6, 145, 157, 152.0, 156.4, 157.0, 157.0, 0.07901806879839857, 0.05872338901912237, 0.039663366564821154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 190.66666666666669, 142, 455, 152.0, 454.4, 455.0, 455.0, 0.07902139899484781, 0.02905682692206383, 0.044624454093835274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 298.6666666666667, 143, 1766, 152.0, 981.8000000000004, 1766.0, 1766.0, 0.07901806879839857, 4.759917796515303, 0.04600127416635937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 218.86666666666665, 141, 898, 152.0, 623.2000000000002, 898.0, 898.0, 0.07902098270494091, 1.568864893216312, 0.04608013945886431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c446f4-cb27-44b1-8a74-69485c305d0c", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.7713428442028986, 1.4412552838164252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 149.8, 144, 164, 148.0, 164.0, 164.0, 164.0, 0.0878456727221617, 0.06528374701324713, 0.049327404116448224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d343693-9d8e-4d9c-9afc-74e95f995f04", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d79da37-8307-439f-ad1f-9c7c08a2830e", 3, 0, 0.0, 927.3333333333334, 275, 1859, 648.0, 1859.0, 1859.0, 1859.0, 0.019746975421597923, 0.023340256430931662, 0.012663262233251274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1056.5882352941178, 144, 1832, 1399.0, 1808.8, 1832.0, 1832.0, 0.10920256433315775, 57.8125075277503, 0.05867881357837532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 230.99999999999997, 145, 562, 152.5, 452.9, 556.55, 562.0, 0.10625355285317353, 0.028638652917456927, 0.06246546759532271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 791.1764705882352, 146, 1370, 901.0, 1294.8, 1370.0, 1370.0, 0.1092046688207823, 18.90023671717918, 0.05878658958637126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 193.39999999999998, 140, 455, 152.0, 432.8, 453.9, 455.0, 0.10625524635278867, 0.02863910936852507, 0.0625702280768863], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 579.8461538461539, 157, 1701, 513.0, 1252.5999999999995, 1701.0, 1701.0, 0.08694023861751646, 0.016471099894334172, 0.059464458579664016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5f56be9f-156e-4364-beb7-32d71e1ae72a", 3, 0, 0.0, 1470.3333333333333, 285, 3515, 611.0, 3515.0, 3515.0, 3515.0, 0.043179135841561356, 0.027760023856472554, 0.027689745315063765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c6d8e51-6e91-4d03-8b19-fbedd2c1eee6", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 472.4666666666667, 296, 1924, 306.0, 1137.4000000000005, 1924.0, 1924.0, 0.07895401718039415, 6.411302645880705, 0.1762226934241831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fa743b7-eb58-4a3e-be62-23f7ac2bb854", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 692.5, 184, 1652, 724.5, 1413.6000000000006, 1641.5499999999997, 1652.0, 0.09394037604332531, 0.057703609893800405, 0.04247499424615196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 171.23529411764707, 146, 435, 154.0, 223.7999999999998, 435.0, 435.0, 0.10919975847582832, 0.08115333613291538, 0.05481316001618726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 301.88235294117646, 145, 616, 162.0, 494.39999999999986, 616.0, 616.0, 0.10919905703402513, 0.12569684655605445, 0.05688287277025161], "isController": false}, {"data": ["login", 20, 0, 0.0, 3478.15, 1301, 5714, 3423.0, 4813.3, 5669.249999999999, 5714.0, 0.09085829286353539, 27.299123849222937, 0.1747513747995439], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 157.5, 143, 179, 156.0, 171.20000000000002, 178.65, 179.0, 0.11102537484942183, 0.08988284741227608, 0.03946605121600542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c44ee0ac-ce61-4a11-b3aa-f8b94b341cb5", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c3ecd6b-8adc-4a31-970f-904ecbb5d55d", 3, 0, 0.0, 398.0, 275, 613, 306.0, 613.0, 613.0, 613.0, 0.044465524396751055, 0.02858704774856228, 0.02851467547578111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1246.8235294117646, 307, 1988, 1553.0, 1965.6, 1988.0, 1988.0, 0.1090918424970481, 76.84124695385094, 0.22893118671068843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c105bc41-a0ff-4459-b3d6-b19ca09bef24", 3, 0, 0.0, 458.0, 234, 900, 240.0, 900.0, 900.0, 900.0, 0.01991661576864859, 0.02354076557811297, 0.012772048523514885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 714.5333333333334, 299, 1975, 603.0, 1685.2000000000003, 1975.0, 1975.0, 0.13304595407253664, 21.401264587934506, 0.29468466168631313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1271.9999999999998, 152, 1965, 1586.0, 1965.0, 1965.0, 1965.0, 0.11995338954006445, 102.51342514051683, 0.21590940734457467], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1289.7826086956522, 194, 3067, 1147.0, 2099.0000000000005, 2892.9999999999973, 3067.0, 0.08924829652164465, 0.027981038617349865, 0.04026632128222639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da3efcd6-207a-4a8e-b4ba-841126a308f8", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.7064954369469026, 1.3200878042035398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 155.73333333333335, 147, 169, 156.0, 167.2, 169.0, 169.0, 0.07193899573161958, 0.055851075787732005, 0.02557206488897415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 472.65, 299, 908, 307.5, 897.5, 907.6, 908.0, 0.10616781947223977, 0.16453938427973097, 0.23877391430133613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c9797d7-5e2b-4385-bf95-85e19cbb4e18", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 481.0, 298, 918, 595.0, 674.0, 918.0, 918.0, 0.10148108980008226, 0.15727586866477591, 0.22823334942342718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d343693-9d8e-4d9c-9afc-74e95f995f04", 3, 0, 0.0, 362.0, 240, 588, 258.0, 588.0, 588.0, 588.0, 0.020444741271799204, 0.02416499204358819, 0.013110722755678527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/068fbb90-df50-4ce7-b8bc-ee9b2cd21c91", 3, 0, 0.0, 930.0, 344, 1388, 1058.0, 1388.0, 1388.0, 1388.0, 0.036202152821354444, 0.022944528497127963, 0.023215573261089927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 210.0, 145, 446, 152.0, 446.0, 446.0, 446.0, 0.03029807243663158, 0.022516438597926403, 0.015208212141043589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 203.2, 145, 420, 152.0, 420.0, 420.0, 420.0, 0.030296603750719544, 0.008106708425485503, 0.01727853182658224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 270.0, 153, 457, 154.0, 457.0, 457.0, 457.0, 0.030296603750719544, 0.008165881479686127, 0.017811089314387858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 149.2, 147, 153, 149.0, 153.0, 153.0, 153.0, 0.030296603750719544, 0.008165881479686127, 0.01784067584148817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 1.878483280254777, 3.9373507165605095], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1719.8235294117649, 1156, 2627, 1609.0, 2461.8000000000006, 2564.4, 2627.0, 0.22730311538975798, 271.93354935486025, 0.4488348626153229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1289.7826086956522, 194, 3067, 1147.0, 2099.0000000000005, 2892.9999999999973, 3067.0, 0.09319022556086334, 0.029216908353490785, 0.042044808797967646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 151.33333333333334, 146, 156, 152.0, 156.0, 156.0, 156.0, 0.058801622924792726, 0.01584887492894804, 0.03462634631215822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 150.0, 146, 157, 147.0, 157.0, 157.0, 157.0, 0.05880738620770769, 0.01585042831379621, 0.03457231103226565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 379.7333333333333, 145, 1804, 151.0, 1708.6000000000001, 1804.0, 1804.0, 0.07107589958396907, 8.543832137086456, 0.040970443679457166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=847ee294-7d40-45cd-a5f1-dd44f1ceda2e", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 323.3333333333333, 147, 1205, 153.0, 1147.4, 1205.0, 1205.0, 0.07107320540156362, 2.8029865553186446, 0.041038298092868984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 173.0, 147, 455, 153.0, 281.60000000000014, 455.0, 455.0, 0.07107455246723463, 0.05282005315191949, 0.035676093718904886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 149.0, 147, 151, 149.0, 151.0, 151.0, 151.0, 0.05880738620770769, 0.015735570137609282, 0.033538587446583286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 186.99999999999997, 142, 433, 151.0, 433.0, 433.0, 433.0, 0.07107286864312418, 0.03325062721806578, 0.039737877337705105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 153.66666666666666, 149, 159, 153.0, 159.0, 159.0, 159.0, 0.05879355622623761, 0.043693258093912904, 0.029511609277623172], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 719.5384615384615, 159, 1643, 613.0, 1408.9999999999998, 1643.0, 1643.0, 0.08565931314409214, 0.016048251726364617, 0.05829878133154107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 157.33333333333334, 155, 161, 156.0, 161.0, 161.0, 161.0, 0.06030393181635443, 0.04746579008201335, 0.02143616326284474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1615.7, 826, 2179, 1696.5, 2148.1, 2177.5, 2179.0, 0.09130794059505386, 0.047258992690799355, 0.041998085957295275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb1e6206-b792-40c8-9bbd-21cc24129cd6", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 307.0, 302, 310, 309.0, 310.0, 310.0, 310.0, 0.05861779245393618, 0.09084612951601242, 0.13183278908341312], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 1539.9827586206898, 764, 4458, 1204.5, 2710.6, 2881.1999999999994, 4458.0, 0.28705765899529817, 89.9253791218139, 1.0441654680153427], "isController": true}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 267.86274509803945, 146, 806, 155.0, 603.6, 612.6, 806.0, 0.22891614936105462, 0.17012225553101815, 0.11065770891965043], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 967.9215686274509, 696, 1493, 898.0, 1308.0, 1355.0, 1493.0, 0.2288709481988754, 67.29565800117128, 0.1151059944554891], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 233.58823529411768, 145, 461, 154.0, 454.8, 457.2, 461.0, 0.22930520522815867, 0.40576272643889016, 0.11151757051135061], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1447.9999999999998, 999, 2008, 1410.0, 1804.6000000000001, 1954.6, 2008.0, 0.22815729432290968, 205.29633448949807, 0.11452426687692926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 162.94736842105266, 153, 220, 156.0, 199.0, 220.0, 220.0, 0.09920945727205323, 0.07411644024718819, 0.035265861764675166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 5, 2.9940119760479043, 253.6946107784432, 146, 2169, 159.0, 426.6000000000003, 477.4, 2140.4399999999996, 0.7053884071316036, 1.4739288101533692, 0.3420643738199528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 216.6, 147, 460, 157.0, 460.0, 460.0, 460.0, 0.030795003818580476, 0.023848084011849915, 0.010946661513636028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c6d8e51-6e91-4d03-8b19-fbedd2c1eee6", 3, 0, 0.0, 994.6666666666667, 275, 1643, 1066.0, 1643.0, 1643.0, 1643.0, 0.02662524961171511, 0.026703253272686932, 0.01707413467938762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f56be9f-156e-4364-beb7-32d71e1ae72a", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d79da37-8307-439f-ad1f-9c7c08a2830e", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 156.66666666666663, 149, 163, 157.0, 161.8, 163.0, 163.0, 0.13150742578597605, 0.10672135823061142, 0.04674678025985867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 480.6, 300, 904, 308.0, 904.0, 904.0, 904.0, 0.030269825222029166, 0.04691231701890653, 0.06807754637337224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c44ee0ac-ce61-4a11-b3aa-f8b94b341cb5", 3, 0, 0.0, 1387.6666666666667, 505, 3139, 519.0, 3139.0, 3139.0, 3139.0, 0.020147479550308257, 0.023813638752333752, 0.012920095935581794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 631.3333333333334, 296, 2260, 319.0, 1983.4, 2260.0, 2260.0, 0.07102272727272727, 11.424444949988164, 0.15730886748342804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c3ecd6b-8adc-4a31-970f-904ecbb5d55d", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b5024fc-bae5-42a4-8c99-8935f98d1d63", 3, 0, 0.0, 929.3333333333334, 262, 2001, 525.0, 2001.0, 2001.0, 2001.0, 0.024934546814611644, 0.025007597244732577, 0.015989927482026347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 155.26666666666668, 148, 162, 156.0, 159.6, 162.0, 162.0, 0.08063692418516388, 0.06685619983711341, 0.028663906643944973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 175.47058823529414, 148, 450, 156.0, 257.99999999999983, 450.0, 450.0, 0.11193784157503127, 0.0869048672384276, 0.039790404622374397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 170.0526315789474, 144, 457, 152.0, 216.0, 457.0, 457.0, 0.10156462985037927, 0.07547918292591661, 0.05098068334286615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 212.63157894736838, 141, 457, 151.0, 454.0, 457.0, 457.0, 0.10156408693885842, 0.027176327950436723, 0.05792326833231769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 288.3157894736841, 144, 461, 153.0, 451.0, 461.0, 461.0, 0.10156082959161855, 0.02737381735086594, 0.059706659584135124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 242.26315789473682, 141, 454, 153.0, 454.0, 454.0, 454.0, 0.10156028672072524, 0.027373671030195477, 0.059805520402927075], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 43.75, 0.5686433793663688], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.08123476848090982], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.08123476848090982], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5686433793663688], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1231, 16, "406/Not Acceptable", 7, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
