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

    var data = {"OkPercent": 99.13522012578616, "KoPercent": 0.8647798742138365};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8019568151147098, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d3e8947-fe63-4760-80e1-7fe825f718e2"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1bf04c80-7aa1-4232-b832-f727dfdbe692"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=324773f7-0e26-420a-a25d-5a1d3bce41c1"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba028365-b4ce-4980-8c90-a83fbf2484d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52fcdbde-c698-4a7e-b91a-c61f0e7c804f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8727ccfd-c531-476d-a1e1-bec6b4bbae15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8727ccfd-c531-476d-a1e1-bec6b4bbae15"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44f1c977-d544-449e-9b08-e4102e750bbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/760cf41c-af99-4afc-8ae9-fb1f9f3d7326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4762fcee-7a84-4841-866e-0fa568b9a9e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b3fdbe6-6fbb-48e4-9e17-339ac4547599"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4620e7e4-4e49-4966-9841-81ca89caa09d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=011ec131-87d4-4896-af9c-587cfd06297f"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9becb43-1477-432f-a738-59d663066fca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bf04c80-7aa1-4232-b832-f727dfdbe692"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbf495d6-0f17-4792-9113-3184d38171e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e599d21-958d-4342-b11b-3e03740a87f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89b40b0a-c7cc-4bec-be79-9d5770b42ea7"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba028365-b4ce-4980-8c90-a83fbf2484d2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d3e8947-fe63-4760-80e1-7fe825f718e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/324773f7-0e26-420a-a25d-5a1d3bce41c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04de2da5-a653-46ec-a10f-455b244caeb4"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5185185185185185, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9470588235294117, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04de2da5-a653-46ec-a10f-455b244caeb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4762fcee-7a84-4841-866e-0fa568b9a9e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6f264ec1-b462-4a66-a7db-190511324f19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89b40b0a-c7cc-4bec-be79-9d5770b42ea7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9becb43-1477-432f-a738-59d663066fca"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44f1c977-d544-449e-9b08-e4102e750bbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/011ec131-87d4-4896-af9c-587cfd06297f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3eae4c76-3dac-49a2-ae63-b50c4595e0c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbf495d6-0f17-4792-9113-3184d38171e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4620e7e4-4e49-4966-9841-81ca89caa09d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 11, 0.8647798742138365, 332.77830188679275, 100, 1951, 118.5, 863.6000000000013, 1015.3499999999999, 1398.5199999999986, 5.020108058615286, 720.9484825655337, 3.6513997201842283], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d3e8947-fe63-4760-80e1-7fe825f718e2", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1490.0555555555557, 1220, 1771, 1473.0, 1751.5, 1757.25, 1771.0, 0.25108337828035787, 302.1375615793609, 1.2345750094156267], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1bf04c80-7aa1-4232-b832-f727dfdbe692", 3, 0, 0.0, 422.0, 355, 502, 409.0, 502.0, 502.0, 502.0, 0.06747183051076176, 0.030529246227200144, 0.04326806839394553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=324773f7-0e26-420a-a25d-5a1d3bce41c1", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.2367812090432503, 0.9036082896461337], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 580.5384615384614, 421, 964, 469.0, 901.1999999999999, 964.0, 964.0, 0.09792696155236832, 0.017691882702332167, 0.06655973168012534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 580.5384615384614, 421, 964, 469.0, 901.1999999999999, 964.0, 964.0, 0.09558401835213153, 0.017268597065570636, 0.0649672624737144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.9473684210526, 100, 361, 102.0, 306.0, 361.0, 361.0, 0.12335339449064786, 0.042757776133065854, 0.06980473238805679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 103.05263157894737, 101, 107, 103.0, 105.0, 107.0, 107.0, 0.1233557970732214, 0.09167359528586082, 0.061918827827769335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 187.15789473684208, 101, 704, 103.0, 306.0, 704.0, 704.0, 0.12287713579863671, 1.9329528386235173, 0.07180253684697269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 155.89473684210526, 101, 912, 103.0, 306.0, 912.0, 912.0, 0.12271206582533553, 5.842730410068202, 0.07158624317010476], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 229.84615384615384, 180, 355, 205.0, 348.2, 355.0, 355.0, 0.09710043172345798, 0.20398968401278736, 0.0627739119149699], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ba028365-b4ce-4980-8c90-a83fbf2484d2", 3, 0, 0.0, 486.6666666666667, 186, 1088, 186.0, 1088.0, 1088.0, 1088.0, 0.02047516021812871, 0.02420094620834158, 0.013130229697172379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 117.76470588235294, 102, 306, 103.0, 177.19999999999987, 306.0, 306.0, 0.095309109868978, 0.07083030528348855, 0.04784070553970185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 126.23529411764704, 101, 306, 103.0, 303.6, 306.0, 306.0, 0.09530964421470459, 0.042344025066436426, 0.053414573124922905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 556.75, 502, 713, 506.0, 713.0, 713.0, 713.0, 0.07479431563201197, 21.99201220082274, 0.04265613313388183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 911.75, 901, 922, 912.0, 922.0, 922.0, 922.0, 0.07424731781564392, 66.80786708337973, 0.042271666295430076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 203.25, 102, 307, 202.0, 307.0, 307.0, 307.0, 0.07508493983819196, 0.13286514744805059, 0.04157535242993636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 104.7, 103, 111, 104.0, 110.5, 111.0, 111.0, 0.054380040349989944, 0.04041329170541245, 0.027296231191303547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52fcdbde-c698-4a7e-b91a-c61f0e7c804f", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 143.3, 101, 305, 103.0, 304.8, 305.0, 305.0, 0.054380631794180186, 0.030886499464350774, 0.030100529395450513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 264.40000000000003, 102, 905, 103.5, 885.1000000000001, 905.0, 905.0, 0.054380631794180186, 9.79808343960215, 0.031035196504412988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 265.0, 101, 712, 104.0, 711.9, 712.0, 712.0, 0.054380040349989944, 3.2096331862353242, 0.03108796447351964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8727ccfd-c531-476d-a1e1-bec6b4bbae15", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 103.5, 102, 105, 103.5, 105.0, 105.0, 105.0, 0.07536504945831371, 0.056008596325953834, 0.04231924163918983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 551.578947368421, 101, 1005, 897.0, 912.0, 1005.0, 1005.0, 0.08680396922570859, 41.11969517815373, 0.047105073349354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 185.35294117647058, 100, 703, 103.0, 699.0, 703.0, 703.0, 0.09531017856642279, 10.112109911557761, 0.055068346508563897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 446.2631578947369, 102, 810, 511.0, 809.0, 810.0, 810.0, 0.08680396922570859, 13.444371504998083, 0.04718984285055098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 227.41176470588235, 101, 703, 103.0, 700.6, 703.0, 703.0, 0.09530964421470459, 3.3196314039671235, 0.055161113595079775], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 554.8461538461538, 211, 1198, 416.0, 1174.8, 1198.0, 1198.0, 0.09531001414987134, 0.01721909435324824, 0.065711787099423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8727ccfd-c531-476d-a1e1-bec6b4bbae15", 3, 0, 0.0, 269.0, 196, 383, 228.0, 383.0, 383.0, 383.0, 0.027813574878779168, 0.02789505996143184, 0.017836179202862942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 390.4, 206, 1009, 214.5, 989.8000000000001, 1009.0, 1009.0, 0.05434930297018941, 13.071516889045897, 0.11945170045381667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 515.3043478260869, 111, 1533, 503.0, 937.4000000000001, 1417.3999999999983, 1533.0, 0.10500940519020399, 0.06450284752406085, 0.04747983847955513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 124.78947368421053, 101, 307, 104.0, 303.0, 307.0, 307.0, 0.08680198639493077, 0.06450811684232648, 0.04357052832714298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 134.0, 100, 304, 103.0, 301.0, 304.0, 304.0, 0.08680476238338465, 0.09184636299467293, 0.04566887067004139], "isController": false}, {"data": ["login", 23, 0, 0.0, 2227.0434782608695, 1502, 3611, 2054.0, 3063.2000000000003, 3507.1999999999985, 3611.0, 0.10489733743193075, 21.97138689957676, 0.18851858022593973], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 107.88235294117646, 104, 114, 107.0, 113.2, 114.0, 114.0, 0.09611959539304434, 0.07781557087972046, 0.034167512424871226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44f1c977-d544-449e-9b08-e4102e750bbe", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/760cf41c-af99-4afc-8ae9-fb1f9f3d7326", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.6412368222891567, 1.1981519829317269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4762fcee-7a84-4841-866e-0fa568b9a9e0", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b3fdbe6-6fbb-48e4-9e17-339ac4547599", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4620e7e4-4e49-4966-9841-81ca89caa09d", 3, 0, 0.0, 265.6666666666667, 180, 406, 211.0, 406.0, 406.0, 406.0, 0.03189758747913366, 0.026280206350809666, 0.02045515863733506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=011ec131-87d4-4896-af9c-587cfd06297f", 1, 0, 0.0, 1198.0, 1198, 1198, 1198.0, 1198.0, 1198.0, 1198.0, 0.8347245409015025, 0.15080472662771285, 0.5755034432387313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 688.3684210526317, 205, 1110, 1000.0, 1023.0, 1110.0, 1110.0, 0.08676116022503105, 54.693435398039654, 0.18344437953212903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9becb43-1477-432f-a738-59d663066fca", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bf04c80-7aa1-4232-b832-f727dfdbe692", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbf495d6-0f17-4792-9113-3184d38171e8", 3, 0, 0.0, 380.3333333333333, 196, 625, 320.0, 625.0, 625.0, 625.0, 0.033977393707386686, 0.028325555105669694, 0.02178888854282284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e599d21-958d-4342-b11b-3e03740a87f4", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89b40b0a-c7cc-4bec-be79-9d5770b42ea7", 3, 0, 0.0, 264.0, 180, 419, 193.0, 419.0, 419.0, 419.0, 0.06955070246209487, 0.03223964853711689, 0.044601199170028284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 337.3157894736842, 206, 1015, 211.0, 464.0, 1015.0, 1015.0, 0.12262890556928856, 7.901458900760945, 0.2741439272068362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1015.25, 1005, 1025, 1015.5, 1025.0, 1025.0, 1025.0, 0.07410701052319549, 88.65774835111901, 0.16710262431451015], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1103.869565217391, 224, 1951, 1027.0, 1653.4, 1902.1999999999994, 1951.0, 0.10991531741632099, 0.0349645702311089, 0.049590699849941695], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 108.00000000000001, 103, 121, 106.0, 120.1, 121.0, 121.0, 0.0975075974669693, 0.07570169920531308, 0.03466090378708674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 357.94117647058823, 206, 806, 210.0, 803.6, 806.0, 806.0, 0.09525410433126015, 13.536966340631478, 0.21136145955902952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba028365-b4ce-4980-8c90-a83fbf2484d2", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 455.33333333333337, 205, 1016, 408.0, 891.2, 1016.0, 1016.0, 0.09538526106945955, 15.343309190926318, 0.211269659299745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.42857142857143, 103, 117, 104.0, 117.0, 117.0, 117.0, 0.036867912802119374, 0.027398907853918797, 0.01850596404325133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 102.85714285714285, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.03686927209522806, 0.009865410697355945, 0.021027006741809753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 102.28571428571428, 100, 104, 103.0, 104.0, 104.0, 104.0, 0.03686946628814015, 0.009937473335475273, 0.02167521357955114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 131.42857142857144, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.03686946628814015, 0.009937473335475273, 0.021711218917723152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d3e8947-fe63-4760-80e1-7fe825f718e2", 3, 0, 0.0, 684.3333333333334, 183, 1465, 405.0, 1465.0, 1465.0, 1465.0, 0.017267777176603313, 0.02380502485120932, 0.011073411796194182], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 963.1111111111112, 799, 1335, 819.0, 1321.5, 1329.25, 1335.0, 0.2324720387797801, 278.11737873784904, 0.45904146719991734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1103.869565217391, 224, 1951, 1027.0, 1653.4, 1902.1999999999994, 1951.0, 0.10497393907860267, 0.033392694954861205, 0.047361288920228936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 160.57142857142858, 101, 306, 103.0, 306.0, 306.0, 306.0, 0.03855411069435953, 0.010391537648089094, 0.022703250731151172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 132.0, 102, 304, 103.0, 304.0, 304.0, 304.0, 0.03859705228797812, 0.010403111749494104, 0.02269084519273714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 153.94444444444446, 101, 704, 104.0, 436.70000000000044, 704.0, 704.0, 0.09620523784072688, 4.833692084780866, 0.056098844200962054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 159.1111111111111, 100, 710, 104.0, 346.40000000000055, 710.0, 710.0, 0.0962047236519313, 1.5960108945168652, 0.05619249429452542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 115.05555555555557, 102, 307, 104.0, 126.10000000000028, 307.0, 307.0, 0.09620318111852232, 0.07149474690546434, 0.04828948739738327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 189.42857142857144, 103, 307, 106.0, 307.0, 307.0, 307.0, 0.03855453539030959, 0.010316350289985184, 0.02198813346478594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 103.11111111111111, 101, 108, 103.0, 104.4, 108.0, 108.0, 0.09620523784072688, 0.033769959246392305, 0.05441817544094067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.71428571428572, 102, 316, 103.0, 316.0, 316.0, 316.0, 0.03859598822270988, 0.028683151403791227, 0.019373376900852418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.57142857142857, 106, 115, 109.0, 115.0, 115.0, 115.0, 0.03849072373557973, 0.030296409502809825, 0.013682249452881856], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 624.5384615384615, 381, 1526, 462.0, 1350.7999999999997, 1526.0, 1526.0, 0.09758367800388833, 0.017629863701874356, 0.06642170270381853], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1220.5652173913043, 776, 1834, 1187.0, 1674.8000000000002, 1809.9999999999995, 1834.0, 0.10540836575786323, 0.05455706430826905, 0.04848373073432967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 324.7142857142857, 206, 621, 211.0, 621.0, 621.0, 621.0, 0.038531190999113785, 0.05971582042538435, 0.08665755163179595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/324773f7-0e26-420a-a25d-5a1d3bce41c1", 3, 0, 0.0, 288.6666666666667, 182, 462, 222.0, 462.0, 462.0, 462.0, 0.03300438958381465, 0.027514401602913185, 0.02116492430993322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04de2da5-a653-46ec-a10f-455b244caeb4", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1003.4827586206899, 521, 1799, 887.0, 1524.5, 1617.25, 1799.0, 0.27029672055513354, 101.44170569172658, 0.9785695186854259], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 186.1111111111111, 102, 419, 105.0, 414.0, 414.5, 419.0, 0.23318377904541468, 0.17329380454449275, 0.11272067444089871], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 567.8703703703703, 496, 824, 507.5, 711.0, 739.75, 824.0, 0.23293633504872252, 68.49101671857409, 0.1171505981934493], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 170.59259259259258, 101, 418, 106.5, 308.0, 308.0, 418.0, 0.23334096732794346, 0.41290413359202494, 0.113480275126285], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 773.074074074074, 694, 916, 709.0, 912.0, 915.25, 916.0, 0.2329313111444692, 209.59200321736373, 0.11692059953931362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 107.73333333333333, 104, 118, 107.0, 115.6, 118.0, 118.0, 0.09490787608827697, 0.07090285664798036, 0.03373678407825471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, 4.117647058823529, 166.38823529411764, 103, 1018, 110.0, 296.70000000000005, 343.6499999999998, 720.5099999999967, 0.6912929618243628, 1.5303315270763187, 0.3325179507433433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 105.85714285714286, 104, 107, 106.0, 107.0, 107.0, 107.0, 0.037064492216456635, 0.02870326399184581, 0.01317526871756857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 148.26315789473685, 103, 430, 107.0, 319.0, 430.0, 430.0, 0.12633062719831914, 0.10252026484551094, 0.044906590136902506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04de2da5-a653-46ec-a10f-455b244caeb4", 3, 0, 0.0, 352.0, 219, 456, 381.0, 456.0, 456.0, 456.0, 0.01958978980155543, 0.02315446834942961, 0.012562462861023502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 240.2857142857143, 207, 409, 214.0, 409.0, 409.0, 409.0, 0.036847729390275356, 0.05710678373278027, 0.08287140701738686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 281.55555555555554, 206, 814, 209.0, 724.9000000000001, 814.0, 814.0, 0.09614973719071834, 6.531207725831695, 0.21487630069227812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4762fcee-7a84-4841-866e-0fa568b9a9e0", 3, 0, 0.0, 477.33333333333337, 206, 784, 442.0, 784.0, 784.0, 784.0, 0.020550619601180976, 0.024290136644494833, 0.013178619991642748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f264ec1-b462-4a66-a7db-190511324f19", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.31617419554455445, 0.5907719678217822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89b40b0a-c7cc-4bec-be79-9d5770b42ea7", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 0.6062552432885906, 2.3136010906040267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 127.19999999999999, 105, 308, 106.0, 288.6000000000001, 308.0, 308.0, 0.05673694482899485, 0.04704068960919592, 0.020168210857181762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9becb43-1477-432f-a738-59d663066fca", 3, 0, 0.0, 417.66666666666663, 195, 720, 338.0, 720.0, 720.0, 720.0, 0.08050233456770246, 0.03642520997692267, 0.051624218456501905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44f1c977-d544-449e-9b08-e4102e750bbe", 3, 0, 0.0, 654.3333333333333, 212, 1526, 225.0, 1526.0, 1526.0, 1526.0, 0.036581796897863623, 0.03049673888523071, 0.02345902991171593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 107.89473684210526, 103, 131, 105.0, 121.0, 131.0, 131.0, 0.08858758748024263, 0.06877649613944618, 0.031490118987117496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/011ec131-87d4-4896-af9c-587cfd06297f", 3, 0, 0.0, 282.0, 205, 418, 223.0, 418.0, 418.0, 418.0, 0.06483122271686044, 0.04210230772139863, 0.041574709880278345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3eae4c76-3dac-49a2-ae63-b50c4595e0c7", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbf495d6-0f17-4792-9113-3184d38171e8", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4620e7e4-4e49-4966-9841-81ca89caa09d", 1, 0, 0.0, 1140.0, 1140, 1140, 1140.0, 1140.0, 1140.0, 1140.0, 0.8771929824561404, 0.15847724780701755, 0.6047834429824562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 116.4, 101, 306, 103.0, 186.00000000000006, 306.0, 306.0, 0.09557062031703961, 0.0710246504504562, 0.04797197152632652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 169.8, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.09557062031703961, 0.04471161963530251, 0.0534349275574698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 277.33333333333337, 101, 913, 301.0, 788.2, 913.0, 913.0, 0.09544716999140976, 11.47343337389838, 0.055018830931246224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 256.1333333333333, 100, 702, 103.0, 699.6, 702.0, 702.0, 0.09557122923715045, 3.7691401297220155, 0.05518367396512287], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.31446540880503143], "isController": false}, {"data": ["401/Unauthorized", 7, 63.63636363636363, 0.550314465408805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 11, "401/Unauthorized", 7, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
